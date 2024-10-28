import { log } from "cc";

export const DINO_DBUG_MODE: boolean = false;

export class RandomUtil {
    public static checkProbability(probability: number): boolean {
        if (probability > 1 || probability < 0) {
            return false;
        }
        return probability >= Math.random();
    }

    public static getRandomNumber(min: number, max: number): number {
        if (max == min) {
            return max;
        }
        if (max < min) {
            let tmp = max;
            max = min;
            min = tmp;
        }

        let len = max - min;
        return Math.random() * len - min;
    }
};