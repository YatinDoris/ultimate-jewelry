import bracelets from "@/assets/images/banners/bracelets.webp"
import earrings from "@/assets/images/banners/earrings.webp"
import mensJewelry from "@/assets/images/banners/mens-jewelry.webp"
import flashDeals from "@/assets/images/banners/flash-deals.webp"
import necklaces from "@/assets/images/banners/necklaces.webp"

export const bannerList = [
    {
        collection: {
            title: "Flash Deals",
            banner: flashDeals,
        }
    },
    {
        type: "categories",
        title: "Wedding",
        banner: "",
        subCategories: [
            {
                title: "For Her",
                type: "subCategories",
                banner: earrings,
            },
            {
                title: "For Him",
                type: "subCategories",
                banner: earrings,
            }
        ]
    },
    {
        type: "categories",
        title: "Jewelry",
        banner: earrings,
        subCategories: [
            {
                title: "Earrings",
                type: "subCategories",
                banner: earrings,
            },
            {
                title: "Bracelets",
                type: "subCategories",
                banner: bracelets,
            },
            {
                title: "Necklaces",
                type: "subCategories",
                banner: necklaces,
            }, {
                title: "Men’s Jewelry",
                type: "subCategories",
                banner: mensJewelry,
            }
        ]
    }
]