import {
    ICompare
} from '@datastructures-js/priority-queue';

import { IGridItem } from 'interfaces/IGridItem';

export const compare: ICompare<IGridItem> = (a: IGridItem, b: IGridItem) => {
    // Prioritize GridItem with lower fCost
    if (a.fCost < b.fCost) {
        return -1;
    }

    // If fcost for both items are the same, prioritize item with lower hCost
    if (a.fCost === b.fCost) {
        if (a.hCost < b.hCost) {
            return -1;
        }
    }

    return 1;
};