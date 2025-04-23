import { ResultStatus } from "../types";
import { Result } from "./result";

export class Response extends Result {
  event: string;
  constructor(event: string, status: ResultStatus, data: any, message: string) {
    super(status, data, message);
    this.event = event;
  }

}