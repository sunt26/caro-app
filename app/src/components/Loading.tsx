import { Loader2 } from "lucide-react";
import { LoadingProps } from "../types";

export const Loading = (props: LoadingProps) => {
  const { isLoading, cancelHandler, desc="Please wait", title = "Wait a moment..." } = props;

  if (!isLoading) {
    return null;
  }

  return (
    <div className="caro-game-container">
      <h1 className="page-title">{title}</h1>
      <div className="loading-container">
        <div className="loader-wrapper">
          <Loader2 className="loader-icon" />
        </div>
        <p className="loading-text">{desc}</p>
        <p className="loading-subtext">This might take a few moments</p>
      </div>
      {
        cancelHandler && (
          <div className="button-container">
            <button className="cancel-button" onClick={cancelHandler}>
              Cancel
            </button>
          </div>
        )
      }
    </div>
  );
}