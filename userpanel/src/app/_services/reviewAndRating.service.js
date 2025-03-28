import { uid } from "uid";
import {
  fetchWrapperService,
  helperFunctions,
  productsUrl,
  reviewAndRatingUrl,
  sanitizeObject,
} from "../_helper";
import { authenticationService } from "./authentication.service";

export const validateReviewText = (review) => {
  // Check if the length is higher than 60 characters
  if (review.length > 250) {
    return "Review should not exceed 250 characters.";
  }

  // If the short description is valid, return null
  return null;
};

const getReviewAndRatingListByProductId = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { productId } = sanitizeObject(params);
      productId = productId ? productId?.trim() : null;
      if (productId) {
        const productData = await fetchWrapperService.findOne(productsUrl, {
          id: productId,
        });
        if (productData) {
          const findPattern = {
            url: reviewAndRatingUrl,
            key: "productId",
            value: productId,
          };
          const reviewAndRatingData = await fetchWrapperService.find(
            findPattern
          );
          const usersData = await authenticationService.getAllUsers();

          const updatedReviewAndRatingData = reviewAndRatingData.map(
            (review) => {
              const user = usersData.find((user) => user.id === review?.userId);
              if (user) {
                review.name = user.name;
                review.email = user.email;
              }
              return review;
            }
          );

          resolve(helperFunctions.sortByField(updatedReviewAndRatingData));
        } else {
          reject(new Error("Product does not exists"));
        }
      } else {
        reject(new Error("Invalid data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const insertReviewAndRating = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { name, email, productId, review, stars } = sanitizeObject(params);
      name = name ? name?.trim() : null;
      email = email ? email?.trim() : null;
      productId = productId ? productId?.trim() : null;
      review = review ? review?.trim() : null;
      stars = stars ? Number(stars) : null;

      if (review && productId) {
        const reviewErrorMsg = validateReviewText(review);
        if (reviewErrorMsg) {
          reject(new Error(reviewErrorMsg));
          return;
        }

        if (Number(stars) < 0 || Number(stars) > 5) {
          reject(new Error("star rating must be between 1 to 5"));
          return;
        }
        const userData = helperFunctions.getCurrentUser();
        if (!userData && (!name || !email)) {
          reject(new Error("Invalid data"));
          return;
        }

        const productData = await fetchWrapperService.findOne(productsUrl, {
          id: productId,
        });
        if (productData) {
          const rrFindPattern = {
            url: reviewAndRatingUrl,
            key: "productId",
            value: productId,
          };
          const rrWithProductIdData = await fetchWrapperService.find(
            rrFindPattern
          );
          const filteredData = rrWithProductIdData.filter((item) =>
            userData
              ? item.userId === userData.id
              : item?.name?.toLowerCase() === name.toLowerCase()
          );
          if (filteredData?.length) {
            reject(
              new Error("You have already provided a review for this product.")
            );
            return;
          }
          const uuid = uid();
          let insertPattern = {
            productId,
            review,
            stars,
            id: uuid,
            createdDate: Date.now(),
            updatedDate: Date.now(),
          };
          if (userData) {
            insertPattern.userId = userData.id;
            insertPattern.userType = 0;
          } else {
            insertPattern.name = name;
            insertPattern.email = email;
            insertPattern.userType = 1;
          }
          const createPattern = {
            url: `${reviewAndRatingUrl}/${uuid}`,
            insertPattern,
          };
          fetchWrapperService
            .create(createPattern)
            .then(async (response) => {
              const totalReviews = Number(productData.totalReviews) + 1;
              const totalStar = Number(productData.totalStar) + Number(stars);
              const payload = {
                totalReviews,
                totalStar,
                starRating: parseFloat(
                  helperFunctions.toFixedNumber(totalStar / totalReviews)
                ),
                updatedDate: Date.now(),
              };
              const productUpdatePattern = {
                url: `${productsUrl}/${productData?.id}`,
                payload,
              };
              await fetchWrapperService._update(productUpdatePattern);
              resolve(createPattern);
            })
            .catch((e) => {
              reject(
                new Error(
                  "An error occurred during creating a new review and rating."
                )
              );
            });
        } else {
          reject(new Error("Product does not exists"));
        }
      } else {
        reject(new Error("Invalid data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateReviewAndRating = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { reviewId, review, stars } = sanitizeObject(params);
      reviewId = reviewId ? reviewId?.trim() : null;
      const userData = helperFunctions.getCurrentUser();
      if (!userData) {
        reject(new Error("unAuthorized"));
        return;
      }

      if (reviewId) {
        const rrData = await fetchWrapperService.findOne(reviewAndRatingUrl, {
          id: reviewId,
        });
        if (rrData) {
          if (rrData.userId !== userData.id) {
            reject(new Error("unAuthorized"));
            return;
          }
          review = review ? review?.trim() : rrData.review;
          stars = stars ? Number(stars) : rrData.stars;

          const reviewErrorMsg = validateReviewText(review);
          if (reviewErrorMsg) {
            reject(new Error(reviewErrorMsg));
            return;
          }

          if (Number(stars) < 0 || Number(stars) > 5) {
            reject(new Error("star rating must be between 1 to 5"));
            return;
          }

          const payload = {
            ...rrData,
            review,
            stars,
            updatedDate: Date.now(),
          };
          const updatePattern = {
            url: `${reviewAndRatingUrl}/${reviewId}`,
            payload,
          };
          fetchWrapperService
            ._update(updatePattern)
            .then(() => {
              resolve(true);
            })
            .catch(() => {
              reject(
                new Error("An error occurred during update review and rating.")
              );
              return;
            });
        } else {
          reject(new Error("Product does not exists"));
        }
      } else {
        reject(new Error("Invalid data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const reviewAndRatingService = {
  getReviewAndRatingListByProductId,
  insertReviewAndRating,
  updateReviewAndRating,
};
