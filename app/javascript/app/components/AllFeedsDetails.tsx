import React from "react";
import UpdateFeeds from "./UpdateFeeds";

class AllFeedsDetails extends React.PureComponent {
  public render() {
    return (
      <div className="field">
        <div className="control">
          <UpdateFeeds />
        </div>
      </div>
    );
  }
}

export default AllFeedsDetails;
