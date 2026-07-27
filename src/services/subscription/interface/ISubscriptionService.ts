import { ICreateSubscriptionDto } from "../../../interfaces/dtos/SubscriptionDto";

export interface ISubscriptionService {
  createSubscription(data: ICreateSubscriptionDto): Promise<void>;
}
