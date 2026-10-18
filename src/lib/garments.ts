import shirtImage from "@/assets/shirt-white.jpg";
import trousersImage from "@/assets/garment-trousers.jpg";
import tshirtImage from "@/assets/garment-tshirt.jpg";
import shirtBack from "@/assets/shirt-white-back.jpg";
import tshirtBack from "@/assets/garment-tshirt-back.jpg";
import trousersBack from "@/assets/garment-trousers-back.jpg";

export type OptionGroup = {
  id: string;
  label: string;
  help?: string;
  options: string[];
};

export type LogoArea = { label: string; x: number; y: number; size: number; side?: "front" | "back" };

export type Garment = {
  id: string;
  name: string;
  tagline: string;
  audience: string;
  image: string;
  backImage: string;
  groups: OptionGroup[];
  logoAreas: LogoArea[];
};

export const garments: Garment[] = [
  {
    id: "shirt",
    name: "Formal shirt",
    tagline: "Collar, cuff, placket and finish — specified detail by detail.",
    audience: "Shirt boutiques, uniform programmes, corporate wardrobes",
    image: shirtImage,
    backImage: shirtBack,
    groups: [
      { id: "fit", label: "Fit", options: ["Slim", "Tailored", "Classic", "Relaxed"] },
      { id: "collar", label: "Collar style", help: "Collar shape sets the character of the shirt.", options: ["Cutaway", "Spread", "Semi-cutaway", "Classic point", "Button-down", "Wing (formal)", "Mandarin"] },
      { id: "collarConstruction", label: "Collar construction", options: ["Fused crisp", "Soft unfused", "Removable collar bones", "Hand-finished"] },
      { id: "cuff", label: "Cuff", options: ["Single barrel", "Double (French) cuff", "Rounded barrel", "Mitred", "Two-button barrel"] },
      { id: "placket", label: "Front placket", options: ["Standard stitched", "French (no placket)", "Covered fly front", "Pleated bib"] },
      { id: "fabric", label: "Fabric", options: ["Poplin", "Twill", "Pinpoint Oxford", "Royal Oxford", "Herringbone", "Sateen", "Linen blend"] },
      { id: "pocket", label: "Pocket", options: ["None", "Single rounded", "Single angled", "Flap pocket", "Two pockets"] },
      { id: "back", label: "Back shaping", options: ["Plain back", "Side darts", "Centre box pleat", "Two side pleats"] },
      { id: "buttons", label: "Buttons", options: ["Mother of pearl", "Matte white", "Horn", "Black", "Metal shank"] },
      { id: "stitching", label: "Stitching", help: "Higher stitch counts give a finer, flatter seam.", options: ["Standard 7 spi", "Fine 9 spi", "Luxury 12 spi", "Contrast topstitch", "Single-needle side seam"] },
      { id: "monogram", label: "Monogram", options: ["None", "Cuff", "Chest", "Collar band", "Hem"] },
    ],
    logoAreas: [
      { label: "Left chest", x: 36, y: 33, size: 11 },
      { label: "Right chest", x: 62, y: 33, size: 11 },
      { label: "Collar band", x: 49, y: 13, size: 8 },
      { label: "Cuff", x: 24, y: 62, size: 8 },
      { label: "Back yoke", side: "back", x: 49, y: 24, size: 14 },
    ],
  },
  {
    id: "tshirt",
    name: "T-shirt",
    tagline: "Weight, knit, neckline and decoration built to your brief.",
    audience: "Retail ranges, merchandise, staff and event wear",
    image: tshirtImage,
    backImage: tshirtBack,
    groups: [
      { id: "fit", label: "Fit", options: ["Regular", "Slim", "Boxy", "Oversized", "Longline"] },
      { id: "weight", label: "Fabric weight", help: "Heavier weights hold shape and print better.", options: ["140 gsm light", "180 gsm standard", "220 gsm heavy", "240 gsm premium"] },
      { id: "knit", label: "Knit / yarn", options: ["Single jersey", "Combed ring-spun", "Pima cotton", "Organic cotton", "Cotton / elastane", "Slub jersey"] },
      { id: "neckline", label: "Neckline", options: ["Crew", "V-neck", "Scoop", "Henley placket", "High crew"] },
      { id: "sleeve", label: "Sleeve", options: ["Short set-in", "Long sleeve", "Raglan", "Cap", "Rolled cuff"] },
      { id: "necktrim", label: "Neck trim", options: ["1x1 rib", "2x2 rib", "Self-fabric bind", "Taped shoulder to shoulder"] },
      { id: "hem", label: "Hem finish", options: ["Double-needle straight", "Curved hem", "Side slit", "Coverstitch", "Raw edge"] },
      { id: "decoration", label: "Decoration method", options: ["Screen print", "Embroidery", "DTG print", "Heat transfer", "Woven badge", "Puff print"] },
      { id: "label", label: "Labelling", options: ["Standard neck label", "Tagless print", "Custom woven label", "Hem flag label"] },
      { id: "stitching", label: "Stitching", options: ["Standard overlock", "Flatlock seams", "Twin-needle finish", "Contrast stitch"] },
    ],
    logoAreas: [
      { label: "Centre chest", x: 50, y: 40, size: 22 },
      { label: "Left chest", x: 37, y: 33, size: 11 },
      { label: "Upper back", side: "back", x: 50, y: 26, size: 20 },
      { label: "Sleeve", x: 18, y: 38, size: 9 },
    ],
  },
  {
    id: "trousers",
    name: "Trousers",
    tagline: "Waistband, pleats, pockets and hem to your specification.",
    audience: "Suit boutiques, formalwear ranges, workwear programmes",
    image: trousersImage,
    backImage: trousersBack,
    groups: [
      { id: "fit", label: "Fit", options: ["Slim", "Tailored", "Straight", "Wide leg", "Tapered"] },
      { id: "rise", label: "Rise", options: ["Low", "Mid", "High"] },
      { id: "waistband", label: "Waistband", options: ["Standard", "Extended tab", "Side adjusters", "Elasticated back", "Curtained waistband"] },
      { id: "pleats", label: "Pleats", options: ["Flat front", "Single pleat", "Double pleat", "Reverse pleat"] },
      { id: "pockets", label: "Pockets", options: ["Slant front", "Cross (on-seam)", "Jetted rear", "Rear flap", "Coin pocket", "Cargo"] },
      { id: "hem", label: "Hem", options: ["Plain finish", "4 cm turn-up", "5 cm turn-up", "Unfinished for tailoring", "Blind stitched"] },
      { id: "fabric", label: "Fabric", options: ["Wool worsted", "Wool blend", "Cotton chino", "Flannel", "Linen blend", "Performance stretch"] },
      { id: "fastening", label: "Fastening", options: ["Hook and bar", "Button closure", "Zip fly", "Button fly"] },
      { id: "lining", label: "Lining", options: ["Unlined", "Knee lined", "Half lined", "Full lining"] },
      { id: "stitching", label: "Stitching", options: ["Standard", "Reinforced crotch seam", "Bar-tacked stress points", "Hand-finished waistband", "Pick stitch edge"] },
    ],
    logoAreas: [
      { label: "Waistband", x: 50, y: 10, size: 10 },
      { label: "Rear pocket", side: "back", x: 63, y: 20, size: 9 },
      { label: "Thigh", x: 38, y: 36, size: 10 },
      { label: "Hem", x: 40, y: 88, size: 8 },
    ],
  },

];

export const garmentById = (id: string): Garment => {
  const garment = garments.find((item) => item.id === id) ?? garments[0];
  if (!garment) throw new Error("No garments are configured.");
  return garment;
};

export const defaultChoices = (garment: Garment) =>
  Object.fromEntries(garment.groups.map((group) => [group.id, group.options[0] ?? ""]));
