import { ItemCategory } from "./ItemCategory";

export class Item {
    constructor(
      public picture: string,
      public pictureAlt: string,
      public name: string,
      public price: number,
      public info: string,
      public productSpec: boolean,
      public category: ItemCategory
    ) {}
}
