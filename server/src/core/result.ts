import { MESSAGE } from "../constants";
import { ResultStatus } from "../types";

export class Result {
  status: ResultStatus;
  data: any;
  message: string;
  action?: string;

  constructor(status: ResultStatus, data: any, message: string) {
    this.status = status;
    this.data = data;
    this.message = message;
  }

  public static respond_success(data: any, message: string = MESSAGE.SOMETHING_WENT_WRONG): Result {
    return new Result(ResultStatus.OK, data, message);
  }

  public static respond_error(data: any, message: string = MESSAGE.SUCCESS): Result {
    return new Result(ResultStatus.OK, data, message);
  }
}