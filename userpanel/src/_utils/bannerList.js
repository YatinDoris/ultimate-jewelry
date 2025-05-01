import forHim from "@/assets/images/banners/for-him.webp"
import forHer from "@/assets/images/banners/for-her.webp"
import wedding from "@/assets/images/banners/wedding.webp"
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
        collection: {
            title: "Shimmer Edit",
            banner: flashDeals, // need to replace
        }
    },
    {
        collection: {
            title: "Lustra",
            banner: flashDeals, // need to replace
        }
    },
    {
        collection: {
            title: "Prism Pulse",
            banner: flashDeals, // need to replace
        }
    },
    {
        collection: {
            title: "Glow State",
            banner: flashDeals, // need to replace
        }
    },
    {
        collection: {
            title: "Everpure",
            banner: flashDeals, // need to replace
        }
    },
    {
        collection: {
            title: "Lucid Flame",
            banner: flashDeals, // need to replace
        }
    },
    {
        collection: {
            title: "Orovia",
            banner: flashDeals, // need to replace
        }
    },
    {
        collection: {
            title: "Clara",
            banner: flashDeals, // need to replace
        }
    },
    {
        collection: {
            title: "New Aura",
            banner: flashDeals, // need to replace
        }
    },
    {
        collection: {
            title: "The Real Illusion",
            banner: flashDeals, // need to replace
        }
    },
    {
        type: "categories",
        title: "Wedding",
        banner: wedding,
        subCategories: [
            {
                title: "For Her",
                type: "subCategories",
                banner: forHer,
            },
            {
                title: "For Him",
                type: "subCategories",
                banner: forHim,
            }
        ]
    },
    {
        type: "categories",
        title: "Jewelry",
        banner: earrings, // need to replace
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