import { GameObject } from '../models/objects/GameObject';
import { Item } from '../models/objects/item/Item';

export type Cell = {
  entity: GameObject;
  item: Item;
};
