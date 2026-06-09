export type NavMegaMenuColumn = {
  title: string;
  href: string;
  items: { label: string; href: string }[];
};

export type NavMegaMenu = {
  label: string;
  href: string;
  columns: NavMegaMenuColumn[];
};

export const navMegaMenus: Record<string, NavMegaMenu> = {
  "International Collection": {
    label: "International Collection",
    href: "#",
    columns: [
      {
        title: "Italian",
        href: "#",
        items: [
          {
            label: "Italian Living",
            href: "#",
          },
          {
            label: "Italian Bedroom",
            href: "#",
          },
          {
            label: "Italian Dining",
            href: "#",
          },
          {
            label: "Italian Study & Office",
            href: "#",
          },
          {
            label: "Italian outdoor",
            href: "#",
          },
        ],
      },
      {
        title: "American",
        href: "#",
        items: [
          {
            label: "American Living",
            href: "#",
          },
          {
            label: "American Bedroom",
            href: "#",
          },
          {
            label: "American Dining",
            href: "#",
          },
          {
            label: "American Outdoor",
            href: "#",
          },
          {
            label: "American Study & Office",
            href: "#",
          },
        ],
      },
      {
        title: "Malaysian",
        href: "#",
        items: [
          {
            label: "Malaysian Living",
            href: "#",
          },
        ],
      },
      {
        title: "Wood World",
        href: "#",
        items: [
          {
            label: "Wood World Bedroom",
            href: "#",
          },
          {
            label: "Wood World Living",
            href: "#",
          },
          {
            label: "Wood World Dining",
            href: "#",
          },
          {
            label: "Wood World Study&Office",
            href: "#",
          },
        ],
      },
    ],
  },
  Living: {
    label: "Living",
    href: "#",
    columns: [
      {
        title: "Sofas",
        href: "#",
        items: [
          {
            label: "Fabric sofa",
            href: "#",
          },
          {
            label: "Wooden Sofas",
            href: "#",
          },
          {
            label: "Leatherette Sofas",
            href: "#",
          },
          {
            label: "Leather Sofas",
            href: "#",
          },
          {
            label: "Sofa Beds",
            href: "#",
          },
          {
            label: "Sofa Sets",
            href: "#",
          },
          {
            label: "Corner Sofas",
            href: "#",
          },
          {
            label: "L Shaped Sofa",
            href: "#",
          },
          {
            label: "Premium Sofas",
            href: "#",
          },
          {
            label: "Single Seater Sofas",
            href: "#",
          },
          {
            label: "Two Seater Sofas",
            href: "#",
          },
          {
            label: "Three Seater Sofas",
            href: "#",
          },
        ],
      },
      {
        title: "Recliners",
        href: "#",
        items: [
          {
            label: "Fabric Recliners",
            href: "#",
          },
          {
            label: "Leatherette Recliners",
            href: "#",
          },
          {
            label: "Leather Recliners",
            href: "#",
          },
          {
            label: "Single Seater Recliners",
            href: "#",
          },
          {
            label: "Two seater Recliners",
            href: "#",
          },
          {
            label: "Three Seater Recliners",
            href: "#",
          },
          {
            label: "Recliner Sets",
            href: "#",
          },
          {
            label: "Home Theatre Recliners",
            href: "#",
          },
        ],
      },
      {
        title: "Seatings",
        href: "#",
        items: [
          {
            label: "Lounge chairs",
            href: "#",
          },
          {
            label: "Rocking Chairs",
            href: "#",
          },
          {
            label: "Accent Chairs",
            href: "#",
          },
          {
            label: "Ottomans & Poufs",
            href: "#",
          },
          {
            label: "Patio Chairs & Set",
            href: "#",
          },
          {
            label: "Balcony Chairs & Set",
            href: "#",
          },
        ],
      },
      {
        title: "Living Room Tables",
        href: "#",
        items: [
          {
            label: "Wooden Center Tables",
            href: "#",
          },
          {
            label: "Glass Center Tables",
            href: "#",
          },
          {
            label: "Marble Center Tables",
            href: "#",
          },
          {
            label: "Side & End Tables",
            href: "#",
          },
          {
            label: "Console Tables",
            href: "#",
          },
        ],
      },
      {
        title: "Entertainment Units",
        href: "#",
        items: [
          {
            label: "TV Stand",
            href: "#",
          },
          {
            label: "Wall Unit",
            href: "#",
          },
        ],
      },
      {
        title: "Shoe Racks",
        href: "#",
        items: [
          {
            label: "Wooden Shoe Racks",
            href: "#",
          },
        ],
      },
      {
        title: "Decor",
        href: "#",
        items: [
          {
            label: "Ottomans",
            href: "#",
          },
          {
            label: "Side Tables",
            href: "#",
          },
          {
            label: "Multipurpose Racks",
            href: "#",
          },
          {
            label: "Wall Paintings",
            href: "#",
          },
          {
            label: "Clocks",
            href: "#",
          },
          {
            label: "Buddha Idols",
            href: "#",
          },
          {
            label: "Spiritual Idols",
            href: "#",
          },
          {
            label: "Showpieces",
            href: "#",
          },
          {
            label: "Flower Vases",
            href: "#",
          },
          {
            label: "Plants and Planters",
            href: "#",
          },
          {
            label: "Artificial Flowers",
            href: "#",
          },
          {
            label: "Artificial Trees",
            href: "#",
          },
          {
            label: "Fountains",
            href: "#",
          },
          {
            label: "Carpets",
            href: "#",
          },
          {
            label: "Door Curtains",
            href: "#",
          },
          {
            label: "Window Curtains",
            href: "#",
          },
          {
            label: "Cushion Covers",
            href: "#",
          },
          {
            label: "Mandir",
            href: "#",
          },
        ],
      },
    ],
  },
  Bedroom: {
    label: "Bedroom",
    href: "#",
    columns: [
      {
        title: "Beds",
        href: "#",
        items: [
          {
            label: "Queen Bed Without Storage",
            href: "#",
          },
          {
            label: "King Bed Without Storage",
            href: "#",
          },
          {
            label: "Queen Bed With Storage",
            href: "#",
          },
          {
            label: "King Bed with Storage",
            href: "#",
          },
          {
            label: "Bedroom Sets",
            href: "#",
          },
          {
            label: "Bunk Bed",
            href: "#",
          },
          {
            label: "Kids Bed",
            href: "#",
          },
          {
            label: "Single Bed",
            href: "#",
          },
          {
            label: "Wooden Bed",
            href: "#",
          },
          {
            label: "Engineered wood bed",
            href: "#",
          },
          {
            label: "Folding Beds",
            href: "#",
          },
        ],
      },
      {
        title: "Wardrobes",
        href: "#",
        items: [
          {
            label: "Two Door Wardrobes",
            href: "#",
          },
          {
            label: "Three Door Wardrobes",
            href: "#",
          },
          {
            label: "Four Door Wardrobes",
            href: "#",
          },
          {
            label: "Five Door Wardrobes",
            href: "#",
          },
        ],
      },
      {
        title: "Tables",
        href: "#",
        items: [
          {
            label: "Dressing Tables",
            href: "#",
          },
          {
            label: "Side Tables",
            href: "#",
          },
        ],
      },
      {
        title: "Decor",
        href: "#",
        items: [
          {
            label: "Bedsheets",
            href: "#",
          },
          {
            label: "Carpets",
            href: "#",
          },
          {
            label: "Bath Mats",
            href: "#",
          },
          {
            label: "Ottomans",
            href: "#",
          },
          {
            label: "Multipurpose Racks",
            href: "#",
          },
          {
            label: "Side Tables",
            href: "#",
          },
          {
            label: "Table Lamps",
            href: "#",
          },
          {
            label: "Buddha Idols",
            href: "#",
          },
          {
            label: "Spiritual Idols",
            href: "#",
          },
          {
            label: "Wall Paintings",
            href: "#",
          },
          {
            label: "Flower Vases",
            href: "#",
          },
          {
            label: "Door Curtains",
            href: "#",
          },
          {
            label: "Window Curtains",
            href: "#",
          },
          {
            label: "Cushion Covers",
            href: "#",
          },
          {
            label: "Clocks",
            href: "#",
          },
        ],
      },
    ],
  },
  Mattresses: {
    label: "Mattresses",
    href: "#",
    columns: [
      {
        title: "Single Mattresses",
        href: "#",
        items: [],
      },
      {
        title: "Queen Size Mattresses",
        href: "#",
        items: [],
      },
      {
        title: "King Size Mattresses",
        href: "#",
        items: [],
      },
      {
        title: "Pillows",
        href: "#",
        items: [],
      },
    ],
  },
  Dining: {
    label: "Dining",
    href: "#",
    columns: [
      {
        title: "Dining Tables & Sets",
        href: "#",
        items: [
          {
            label: "4 Seater Dining Sets",
            href: "#",
          },
          {
            label: "6 Seater Dining Sets",
            href: "#",
          },
          {
            label: "8 Seater Dining Sets",
            href: "#",
          },
        ],
      },
      {
        title: "Dining Tables & Chairs",
        href: "#",
        items: [
          {
            label: "Tables",
            href: "#",
          },
          {
            label: "Chairs",
            href: "#",
          },
        ],
      },
      {
        title: "Bar Furniture",
        href: "#",
        items: [
          {
            label: "Bar Stools & Chairs",
            href: "#",
          },
          {
            label: "Bar Cabinets",
            href: "#",
          },
        ],
      },
      {
        title: "Crockery Units",
        href: "#",
        items: [
          {
            label: "Side Board",
            href: "#",
          },
          {
            label: "Crockery Unit",
            href: "#",
          },
        ],
      },
      {
        title: "Decor",
        href: "#",
        items: [
          {
            label: "Table Mats",
            href: "#",
          },
          {
            label: "Carpets",
            href: "#",
          },
          {
            label: "Multipurpose Racks",
            href: "#",
          },
          {
            label: "Wall Paintings",
            href: "#",
          },
          {
            label: "Clocks",
            href: "#",
          },
          {
            label: "Flower Vases",
            href: "#",
          },
          {
            label: "Plants and Planters",
            href: "#",
          },
          {
            label: "Artificial Flowers",
            href: "#",
          },
          {
            label: "Door Curtains",
            href: "#",
          },
          {
            label: "Window Curtains",
            href: "#",
          },
        ],
      },
    ],
  },
  "Study & Office": {
    label: "Study &amp; Office",
    href: "#",
    columns: [
      {
        title: "Tables",
        href: "#",
        items: [
          {
            label: "Study Tables",
            href: "#",
          },
          {
            label: "Computer Tables",
            href: "#",
          },
          {
            label: "Boss Table",
            href: "#",
          },
          {
            label: "Conference Tables",
            href: "#",
          },
        ],
      },
      {
        title: "Chairs",
        href: "#",
        items: [
          {
            label: "Office Chairs",
            href: "#",
          },
          {
            label: "Computer Chairs",
            href: "#",
          },
          {
            label: "Visitor Chairs",
            href: "#",
          },
          {
            label: "Study Chairs",
            href: "#",
          },
          {
            label: "Gaming Chairs",
            href: "#",
          },
        ],
      },
      {
        title: "Book Shelves",
        href: "#",
        items: [
          {
            label: "Engineered Wood",
            href: "#",
          },
          {
            label: "Solid Wood",
            href: "#",
          },
        ],
      },
      {
        title: "Decor",
        href: "#",
        items: [
          {
            label: "Magazine Holders",
            href: "#",
          },
          {
            label: "Ottomans",
            href: "#",
          },
          {
            label: "Side Tables",
            href: "#",
          },
          {
            label: "Buddha Idols",
            href: "#",
          },
          {
            label: "Spiritual Idols",
            href: "#",
          },
          {
            label: "Flower Vases",
            href: "#",
          },
          {
            label: "Plants and Planters",
            href: "#",
          },
          {
            label: "Artificial Flowers",
            href: "#",
          },
          {
            label: "Artificial Trees",
            href: "#",
          },
          {
            label: "Clocks",
            href: "#",
          },
          {
            label: "Table Lamps",
            href: "#",
          },
          {
            label: "Cushion Covers",
            href: "#",
          },
        ],
      },
    ],
  },
  Outdoor: {
    label: "Outdoor",
    href: "#",
    columns: [
      {
        title: "Outdoor Furniture",
        href: "#",
        items: [
          {
            label: "Outdoor Set",
            href: "#",
          },
          {
            label: "Outdoor Chairs",
            href: "#",
          },
          {
            label: "Patio Set",
            href: "#",
          },
          {
            label: "Swings",
            href: "#",
          },
          {
            label: "Outdoor Tables",
            href: "#",
          },
          {
            label: "Patio Tables",
            href: "#",
          },
          {
            label: "Balcony Furniture",
            href: "#",
          },
        ],
      },
      {
        title: "Decor",
        href: "#",
        items: [
          {
            label: "Garden Figurines & Furniture",
            href: "#",
          },
          {
            label: "Fountains",
            href: "#",
          },
        ],
      },
      {
        title: "Bar Furniture",
        href: "#",
        items: [
          {
            label: "Bar Stools & Chairs",
            href: "#",
          },
          {
            label: "Bar Cabinets",
            href: "#",
          },
        ],
      },
    ],
  },
  Decor: {
    label: "Decor",
    href: "#",
    columns: [
      {
        title: "Furniture Accents",
        href: "#",
        items: [
          {
            label: "Benches",
            href: "#",
          },
          {
            label: "Side Tables",
            href: "#",
          },
          {
            label: "Magazine Holders",
            href: "#",
          },
          {
            label: "Ottomans",
            href: "#",
          },
          {
            label: "Mandir",
            href: "#",
          },
          {
            label: "Multipurpose Accents",
            href: "#",
          },
          {
            label: "Nesting Tables",
            href: "#",
          },
          {
            label: "Console Tables",
            href: "#",
          },
        ],
      },
      {
        title: "Wall Decor",
        href: "#",
        items: [
          {
            label: "Metal Wall Arts",
            href: "#",
          },
          {
            label: "Crystal Wall Art",
            href: "#",
          },
          {
            label: "Mirrors",
            href: "#",
          },
          {
            label: "Clocks",
            href: "#",
          },
        ],
      },
      {
        title: "Spiritual",
        href: "#",
        items: [
          {
            label: "Buddha Idols",
            href: "#",
          },
          {
            label: "Religious Idols",
            href: "#",
          },
          {
            label: "Ganesha Idols",
            href: "#",
          },
        ],
      },
      {
        title: "Table Decor",
        href: "#",
        items: [
          {
            label: "Showpieces",
            href: "#",
          },
          {
            label: "World Globes",
            href: "#",
          },
          {
            label: "Candles",
            href: "#",
          },
        ],
      },
      {
        title: "Home Garden",
        href: "#",
        items: [
          {
            label: "Plants & Planters",
            href: "#",
          },
          {
            label: "Garden Figurines & Furniture",
            href: "#",
          },
          {
            label: "Artificial Plants & Trees",
            href: "#",
          },
          {
            label: "Artificial Flowers",
            href: "#",
          },
        ],
      },
      {
        title: "Vases",
        href: "#",
        items: [
          {
            label: "Table Vases",
            href: "#",
          },
          {
            label: "Floor Vases",
            href: "#",
          },
        ],
      },
      {
        title: "Lighting",
        href: "#",
        items: [
          {
            label: "Table Lamps",
            href: "#",
          },
        ],
      },
      {
        title: "Kitchen",
        href: "#",
        items: [
          {
            label: "Trays and platters",
            href: "#",
          },
          {
            label: "Organizers",
            href: "#",
          },
        ],
      },
    ],
  },
  Furnishings: {
    label: "Furnishings",
    href: "#",
    columns: [
      {
        title: "Bed Linen",
        href: "#",
        items: [
          {
            label: "Pillows",
            href: "#",
          },
          {
            label: "Bed In A Bag",
            href: "#",
          },
          {
            label: "Mattress Protectors",
            href: "#",
          },
          {
            label: "Comforter",
            href: "#",
          },
        ],
      },
      {
        title: "Flooring",
        href: "#",
        items: [
          {
            label: "Door Mats",
            href: "#",
          },
          {
            label: "Carpets",
            href: "#",
          },
        ],
      },
      {
        title: "TABLE LINEN",
        href: "#",
        items: [
          {
            label: "Table Mats",
            href: "#",
          },
        ],
      },
      {
        title: "Bath Mats",
        href: "#",
        items: [],
      },
      {
        title: "Table Mats",
        href: "#",
        items: [],
      },
    ],
  },
};
