import "./index.css";

export const InvoiceLoader = () => {
    return (
        <div id="page">
                <div id="container">
                    <div id="ring"></div>
                    <div id="ring"></div>
                    <div id="ring"></div>
                    <div id="ring"></div>
                    <div id="h3">loading</div>
                </div>
        </div>
    );
  };

export const InvoiceFailure = ({ message = "Something went wrong!" }) => {
  return (
    <div className="failure-container">
      <div className="failure-icon">!</div>
      <p className="failure-text">{message}</p>
    </div>
  );
};
