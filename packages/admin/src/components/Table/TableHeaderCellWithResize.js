import React, { Component } from "react";
import styled from "react-emotion/macro";

class TableHeaderCellWithResize extends Component {
  state = {
    minWidth: 50,
    cellWidth: null,
    startX: null
  };

  componentDidMount() {
    const { currentlyResizing, minWidth } = this.state;
    this.setState({
      cellWidth: Math.max(this.cell.current.clientWidth, minWidth + 100),
      startX: 0
    });
  }

  render() {
    const { cellWidth } = this.state;
    return (
      <TableHeaderCell
        style={{
          width: `${cellWidth}px`
        }}
        onClick={this.props.onClick}
        innerRef={this.cell}
      >
        {this.props.children}
        <ResizeHandler
          onMouseDown={e => this.resizeColumnStart(e, false)}
          onTouchStart={e => this.resizeColumnStart(e, true)}
        />
      </TableHeaderCell>
    );
  }

  cell = React.createRef();

  resizeColumnStart = (event, isTouch) => {
    event.stopPropagation();
    const { minWidth } = this.state;
    const cellWidth = event.target.parentElement.getBoundingClientRect().width;

    let pageX;
    if (isTouch) {
      pageX = event.changedTouches[0].pageX;
    } else {
      pageX = event.pageX;
    }

    this.setState(
      {
        startX: pageX,
        cellWidth
      },
      () => {
        if (isTouch) {
          document.addEventListener("touchmove", this.resizeColumnMoving);
          document.addEventListener("touchcancel", this.resizeColumnEnd);
          document.addEventListener("touchend", this.resizeColumnEnd);
        } else {
          document.addEventListener("mousemove", this.resizeColumnMoving);
          document.addEventListener("mouseup", this.resizeColumnEnd);
          document.addEventListener("mouseleave", this.resizeColumnEnd);
        }
      }
    );
  };

  resizeColumnMoving = event => {
    event.stopPropagation();
    const { minWidth, cellWidth, startX } = this.state;
    let pageX;
    if (event.type === "touchmove") {
      pageX = event.changedTouches[0].pageX;
    } else if (event.type === "mousemove") {
      pageX = event.pageX;
    }

    this.setState({
      cellWidth: Math.max(cellWidth + (pageX - startX), minWidth),
      startX: pageX
    });
  };

  resizeColumnEnd = event => {
    event.stopPropagation();
    const isTouch = event.type === "touchend" || event.type === "touchcancel";

    if (isTouch) {
      document.removeEventListener("touchmove", this.resizeColumnMoving);
      document.removeEventListener("touchcancel", this.resizeColumnEnd);
      document.removeEventListener("touchend", this.resizeColumnEnd);
    }

    document.removeEventListener("mousemove", this.resizeColumnMoving);
    document.removeEventListener("mouseup", this.resizeColumnEnd);
    document.removeEventListener("mouseleave", this.resizeColumnEnd);
  };
}

export default TableHeaderCellWithResize;

const TableHeaderCell = styled.th`
  color: #929499;
  cursor: default;
  font-weight: 700;
  padding: 14px 20px;
  text-shadow: 1px 1px 2px #fff, 0 0 0 #929499;
  border-right: 1px solid #eee;
  text-transform: uppercase;
  border-collapse: collapse;
  position: relative;
`;

const ResizeHandler = styled.div`
  width: 10px;
  height: 100%;
  position: absolute;
  right: -5px;
  top: 0px;
  cursor: col-resize;
  z-index: 999;
`;
