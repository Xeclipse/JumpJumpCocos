import { log } from "cc";

export class ProbabilityUtil {
    public static checkProbability(probability: number): boolean {
        if (probability > 1 || probability < 0) {
            return false;
        }
        return probability >= Math.random();
    }
};