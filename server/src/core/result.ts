import { MESSAGE } from "../constants";
import { ResultStatus } from "../types";

export class Result {
  status: ResultStatus;
  data: any;
  message: string;

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

export class SocketResult extends Result {
  action: string;

  constructor(action: string, status: ResultStatus, data: any, message: string) {
    super(status, data, message);
    this.action = action;
  }

  public static respond_success(action: string, data: any, message: string = MESSAGE.SUCCESS): SocketResult {
    return new SocketResult(action, ResultStatus.OK, data, message);
  }

  public static respond_error(action: string, data: any, message: string = MESSAGE.SOMETHING_WENT_WRONG): SocketResult {
    return new SocketResult(action, ResultStatus.OK, data, message);
  }

  public static fromResult(action:string, result: Result): SocketResult {
    return new SocketResult(action, result.status, result.data, result.message);
  }
}