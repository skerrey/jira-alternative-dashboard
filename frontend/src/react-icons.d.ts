declare module "react-icons/fa" {
  import { ComponentType, SVGProps } from "react";
  export const FaCog: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaComments: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaTimes: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaPaperPlane: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaUser: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaUserCircle: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaFlag: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaTag: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaCalendar: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaClock: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaCheckCircle: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaTimes: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaComments: ComponentType<SVGProps<SVGSVGElement>>;
  // Add other icons from react-icons/fa as needed
}

declare module "react-icons/*" {
  import { ComponentType, SVGProps } from "react";
  const Icon: ComponentType<SVGProps<SVGSVGElement>>;
  export default Icon;
}

