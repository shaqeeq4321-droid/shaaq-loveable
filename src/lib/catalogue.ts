import poloImage from "@/assets/polo-crimson.jpg";
import blueShirt from "@/assets/shirt-blue.jpg";
import charcoalShirt from "@/assets/shirt-charcoal.jpg";
import stripeShirt from "@/assets/shirt-stripe.jpg";
import whiteShirt from "@/assets/shirt-white.jpg";

export const catalogue = [
  { name: "The Mayfair", detail: "Crisp white poplin · Spread collar", description: "A definitive business shirt with a clean, smooth handle and versatile collar shape.", image: whiteShirt, position: "center" },
  { name: "The Richmond", detail: "Sky blue poplin · Semi-cutaway", description: "An adaptable blue formal shirt designed for dependable weekday rotation.", image: blueShirt, position: "center" },
  { name: "The Jermyn", detail: "Fine Bengal stripe · Point collar", description: "A precise blue stripe with a traditional point collar and assured trade appeal.", image: stripeShirt, position: "center" },
  { name: "The City", detail: "Charcoal sateen · Cutaway collar", description: "A modern evening-ready option with subtle lustre and a tailored silhouette.", image: charcoalShirt, position: "center" },
  { name: "The Regent", detail: "White twill · French cuff", description: "A more formal white option, pairing structured twill with a refined cuff finish.", image: whiteShirt, position: "48% 42%" },
  { name: "The Kensington", detail: "Blue pinpoint · Classic collar", description: "A quietly textured blue staple engineered for comfort and repeated wear.", image: blueShirt, position: "52% 40%" },
  { name: "The Burlington", detail: "Blue stripe · Double cuff", description: "A confident striped style for boutique formalwear and occasion-led ranges.", image: stripeShirt, position: "48% 44%" },
  { name: "The Savile", detail: "Black sateen · Spread collar", description: "A sharp monochrome shirt created for evening wardrobes and uniform programmes.", image: charcoalShirt, position: "52% 42%" },
  { name: "The Polo", detail: "Cotton piqué · Collared polo", description: "A comfortable collared polo for hospitality, corporate uniforms and everyday branded workwear.", image: poloImage, position: "center" },
] as const;