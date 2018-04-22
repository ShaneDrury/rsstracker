import React from "react";

export class Feeds extends React.Component {
  async componentDidMount() {
    const response = await fetch("/feeds")
    console.log(response)
  }

  render() {
    return (
      <div>
        adsf
      </div>
    )
  }
}
