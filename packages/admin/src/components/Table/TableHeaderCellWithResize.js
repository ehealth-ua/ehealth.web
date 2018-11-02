//@flow
import * as React from "react";
import styled from "react-emotion/macro";

type CellWithResizeProps = {
  onClick: () => mixed,
  children: React.Node
};

type CellWithResizeState = {
  minWidth: number,
  cellWidth: number,
  startX: number
};

type EventType = any;

class TableHeaderCellWithResize extends React.Component<
  CellWithResizeProps,
  CellWithResizeState
> {
  state = {
    minWidth: 50,
    cellWidth: 0,
    startX: 0
  };

  componentDidMount() {
    const { minWidth } = this.state;
    const { storageForSizes, header } = this.props;
    // $FlowFixMe https://github.com/facebook/flow/issues/6832
    const { current: { clientWidth = 0, textContent } = {} } = this.cell;
    this.setState({
      cellWidth: Math.max(clientWidth, minWidth + 100),
      startX: 0
    });

    this.setDefaultCellWidth(storageForSizes, header, textContent);
  }

  componentDidUpdate(prevProps, prevState) {
    const { cellWidth } = this.state;

    if (prevState.cellWidth !== cellWidth) {
      const { textContent } = this.cell.current;
      const { storageForSizes, header } = this.props;

      this.setUpdatedCellWidth(storageForSizes, header, textContent, cellWidth);
    }
  }

  render() {
    const { onClick, children } = this.props;
    const { cellWidth } = this.state;
    return (
      <TableHeaderCell
        style={{
          width: `${cellWidth}px`
        }}
        onClick={onClick}
        innerRef={this.cell}
      >
        {children}
        <ResizeHandler
          onMouseDown={e => this.resizeColumnStart(e, false)}
          onTouchStart={e => this.resizeColumnStart(e, true)}
          onClick={e => e.stopPropagation()}
        />
      </TableHeaderCell>
    );
  }

  cell = React.createRef();

  resizeColumnStart = (event: EventType, isTouch: boolean) => {
    event.stopPropagation();

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

  resizeColumnMoving = (event: EventType) => {
    event.stopPropagation();
    const { minWidth, cellWidth, startX } = this.state;
    let pageX = 0;
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

  resizeColumnEnd = (event: EventType) => {
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

  getDefaultCellWidth(items) {
    return Object.values(items).map(item => {
      return { [item]: this.state.cellWidth };
    });
  }

  setDefaultCellWidth(storageName, items, cellName) {
    if (localStorage.getItem(storageName) === null) {
      localStorage.setItem(
        storageName,
        JSON.stringify(this.getDefaultCellWidth(items))
      );
    } else {
      const storage = localStorage.getItem(storageName);

      isValidJson(storage) &&
        JSON.parse(storage).find(item => {
          item[cellName] &&
            this.setState({
              cellWidth: item[cellName]
            });
        });
    }
  }

  setUpdatedCellWidth(storageName, items, cellName, cellWidth) {
    const storage = localStorage.getItem(storageName);

    const updateHeader =
      (isValidJson(storage) &&
        JSON.parse(storage).map(item => {
          return item[cellName] === undefined
            ? item
            : { [cellName]: cellWidth };
        })) ||
      this.getDefaultCellWidth(items);

    localStorage.setItem(storageName, JSON.stringify(updateHeader));
  }
}

export default TableHeaderCellWithResize;

const isValidJson = item => {
  if (typeof item !== "string") {
    return false;
  }
  try {
    JSON.parse(item);
    return true;
  } catch (error) {
    return false;
  }
};

const ResizeHandler = styled.div`
  width: 10px;
  height: 100%;
  position: absolute;
  right: -5px;
  top: 0;
  cursor: col-resize;
  z-index: 999;
`;

const TableHeaderCell = styled.th`
  color: #929499;
  cursor: default;
  font-weight: 700;
  padding: 14px 20px;
  text-shadow: 1px 1px 2px #fff, 0 0 0 #929499;
  border-right: 1px solid #eee;
  border-collapse: collapse;
  position: relative;

  &:last-child {
    border-right: none;

    ${ResizeHandler}:last-child {
      display: none;
    }
  }
`;
