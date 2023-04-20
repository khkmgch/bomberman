import { GameObject } from '../models/objects/GameObject';
import { Item } from '../models/objects/item/Item';
import { Index } from './Index';

export type Cell = {
  index: Index;
  entity: GameObject;
  item: Item;
};
