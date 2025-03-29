import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { helperFunctions } from "./helperFunctions";

export const convertImageToBase64 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { redirect: "follow" });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image (${response?.status}): ${response?.statusText}`
      );
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
};

export const generatePDF = async (orderData, sizePage = "1") => {
  let invoiceData = { ...orderData };

  invoiceData = {
    ...invoiceData,
    products: await Promise.all(
      invoiceData?.products?.map(async (x) => ({
        ...x,
        productImage: `data:image/png;base64,${await convertImageToBase64(
          x?.productImage
        )}`,
      }))
    ),
  };

  const doc = new jsPDF(sizePage, "pt", "a4");
  const date = new Date();
  const formattedDate = `Date: ${
    date.getMonth() + 1
  } / ${date.getDate()} / ${date.getFullYear()}`;

  const pageWidth = doc.internal.pageSize.width;
  const topHeight = 25;

  // Title
  doc.setFontSize(20);
  doc.text("Invoice", pageWidth - 150, topHeight);
  doc.setFontSize(10);
  doc
    .text(formattedDate, pageWidth - 150, topHeight + 15)
    .setFont(undefined, "bold");

  // Order Details
  doc.text("Order Details", 40, topHeight).setFont(undefined, "normal");

  doc.text(`Order Number: ${invoiceData?.orderNumber}`, 40, topHeight + 15);
  doc.text(
    `Order Date: ${new Date(invoiceData?.createdDate)?.toLocaleDateString()}`,
    40,
    topHeight + 30
  );
  doc.text(`Order Status: ${invoiceData?.orderStatus}`, 40, topHeight + 45);
  doc
    .text(`Payment Status: ${invoiceData?.paymentStatus}`, 40, topHeight + 60)
    .setFont(undefined, "bold");

  // Shipping Address
  doc.text("Shipping Address", 40, topHeight + 80).setFont(undefined, "normal");
  doc.text(`Name: ${invoiceData?.shippingAddess?.name}`, 40, topHeight + 95);
  doc.text(`Email: ${invoiceData?.shippingAddess?.email}`, 40, topHeight + 110);
  doc.text(
    `Address: ${invoiceData.shippingAddess.address}, ${invoiceData.shippingAddess.city}, ${invoiceData.shippingAddess.state}, ${invoiceData.shippingAddess.country} - ${invoiceData.shippingAddess.pinCode}`,
    40,
    topHeight + 125
  );
  doc.text(
    `Mobile: ${invoiceData?.shippingAddess?.mobile}`,
    40,
    topHeight + 140
  );

  const headers = [["IMAGE", "PRODUCT", "QTY", "UNIT PRICE ($)", "TOTAL ($)"]];
  const data = invoiceData?.products?.map((x) => {
    const variations = x?.variations
      ?.map((y) => `* ${y?.variationName} : ${y?.variationTypeName}`)
      .join("\n");
    return [
      {
        content: "",
        image: x?.productImage,
        width: 35,
        height: 35,
        alias: x?.productName,
      },
      `${x?.productName}\n\n${variations}`,
      x?.cartQuantity,
      helperFunctions.toFixedNumber(x?.productPrice),
      helperFunctions.toFixedNumber(x?.cartQuantity * x?.productPrice),
    ];
  });

  let content = {
    theme: "grid",
    startY: 190,
    head: headers,
    body: data,
    headStyles: { fillColor: [88, 164, 189] },
    columnStyles: {
      2: { halign: "center", valign: "center" },
      3: { cellWidth: 85, halign: "right", valign: "center" },
      4: { cellWidth: 70, halign: "right", valign: "center" },
    },
    didDrawCell: async (data) => {
      if (data?.column?.index === 0 && data?.row?.index >= 0) {
        const img = data?.cell?.raw?.image;
        if (img) {
          const cellWidth = data?.cell?.width;
          const cellHeight = data?.cell?.height;
          const imgWidth = 30;
          const imgHeight = 33;
          // Set Image to center
          const xOffset = data?.cell?.x + (cellWidth - imgWidth) / 2;
          const yOffset = data?.cell?.y + (cellHeight - imgHeight) / 2;
          //   doc.addImage(img, xOffset, yOffset, imgWidth, imgWidth);
          doc.addImage(
            img,
            "JPEG",
            xOffset,
            yOffset,
            imgWidth,
            imgWidth,
            undefined,
            "FAST"
          );
        }
      }
    },
    bodyStyles: {
      minCellHeight: 35, // Set the fixed height for each row
    },
  };

  doc.autoTable(content);

  const bottomRightX = pageWidth - 150;
  const bottomRightY = doc.previousAutoTable.finalY + 20;

  doc.text(
    `Subtotal: $ ${helperFunctions.toFixedNumber(invoiceData?.subTotal)}`,
    bottomRightX,
    bottomRightY
  );

  // Display Shipping Charge
  doc.text(
    `Taxes: $ ${helperFunctions.toFixedNumber(invoiceData?.salesTax)}`,
    bottomRightX,
    bottomRightY + 15
  );

  // Display Taxes
  doc
    .text(
      `Shipping Charge: $ ${helperFunctions.toFixedNumber(
        invoiceData?.shippingCharge
      )}`,
      bottomRightX,
      bottomRightY + 30
    )
    .setFont(undefined, "bold");

  // Display Total Amount
  doc.text(
    `Total Amount: $ ${helperFunctions.toFixedNumber(invoiceData?.total)}`,
    bottomRightX,
    bottomRightY + 50
  );

  doc.save(`${invoiceData?.orderNumber}.pdf`);
};
