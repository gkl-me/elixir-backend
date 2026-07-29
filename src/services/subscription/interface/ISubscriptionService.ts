import { ICancelSubscriptionDto, ICreateSubscriptionDto, ICreateSubscriptionResDto, IListAllSubResDto, IListAllSubscriptionDto, IReactivateSubscriptionDto } from "../../../interfaces/dtos/SubscriptionDto";

export interface ISubscriptionService {
  createSubscription(data: ICreateSubscriptionDto): Promise<ICreateSubscriptionResDto>;
  cancelSubscription(data: ICancelSubscriptionDto): Promise<void>
  reactivateSubscription(data: IReactivateSubscriptionDto): Promise<void>;
  listAllSubscription(data: IListAllSubscriptionDto): Promise<IListAllSubResDto>;
}
