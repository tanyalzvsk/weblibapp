export interface IMenuItem {
  name: string;
  link?: string;
  imageSrc: string;
  isSpecial?: boolean;
  sideAction?: () => void;
}
