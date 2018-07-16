import React, { Component } from "react";

const TRUNCATE_LENGTH = 1;

export default class Pager extends Component {
  static defaultProps = {
    defaultCurrentPage: 1,
    marginPages: 1,
    pageRange: 5,
    rangeOverlap: 1
  };

  state = {
    currentPage: this.props.defaultCurrentPage
  };

  render() {
    const { totalPages, children, render = children } = this.props;

    if (!totalPages || totalPages <= 1) return null;

    const {
      getPageProps,
      prevPage,
      nextPage,
      currentPage,
      leftPages,
      middlePages,
      rightPages,
      isFirstPage,
      isLastPage,
      isLeftRangeTruncated,
      isRightRangeTruncated
    } = this;

    return render({
      getPageProps,
      prevPage,
      nextPage,
      currentPage,
      totalPages,
      leftPages,
      middlePages,
      rightPages,
      isFirstPage,
      isLastPage,
      isLeftRangeTruncated,
      isRightRangeTruncated
    });
  }

  get leftPages() {
    const { marginPages, totalPages } = this.props;

    const length = Math.min(marginPages, totalPages);

    return valuesFromRange(length);
  }

  get middlePages() {
    const { pageRange, marginPages, totalPages } = this.props;
    const { currentPage } = this;

    if (this.shouldRangeBeTruncated) {
      if (this.isCurrentPageInLeftRange) {
        // 1 2 | 3 4 5 (6) _ | 14 15
        return valuesFromRange(pageRange - TRUNCATE_LENGTH, marginPages);
      } else if (this.isCurrentPageInRightRange) {
        // 1 2 _ (10) 11 12 13 | 14 15
        return valuesFromRange(
          pageRange - TRUNCATE_LENGTH,
          this.rightRange.begin
        );
      } else {
        // 1 2 | _ 7 (8) 9 _ | 14 15
        const length = pageRange - 2 * TRUNCATE_LENGTH;

        return valuesFromRange(length, currentPage - Math.ceil(length / 2));
      }
    } else {
      // 1 (2) || 3
      // 1 (2) || 3 4
      // 1 (2) | 3 | 4 5
      // 1 (2) | 3 4 5 6 7 | 8 9

      const length = Math.max(totalPages - marginPages * 2, 0);

      return valuesFromRange(length, marginPages);
    }
  }

  get rightPages() {
    const { totalPages, marginPages } = this.props;

    const restPages = Math.max(totalPages - marginPages, 0);
    const length = Math.min(marginPages, restPages);

    return valuesFromRange(length, restPages);
  }

  get isLeftRangeTruncated() {
    return this.shouldRangeBeTruncated && !this.isCurrentPageInLeftRange;
  }

  get isRightRangeTruncated() {
    return this.shouldRangeBeTruncated && !this.isCurrentPageInRightRange;
  }

  get shouldRangeBeTruncated() {
    const { marginPages, pageRange, totalPages } = this.props;

    const maxPagesLength = marginPages * 2 + pageRange;

    return maxPagesLength < totalPages;
  }

  get isCurrentPageInLeftRange() {
    return this.currentPage <= this.leftRange.end - this.props.rangeOverlap;
  }

  get isCurrentPageInRightRange() {
    return this.currentPage > this.rightRange.begin + this.props.rangeOverlap;
  }

  get prevPage() {
    return this.isFirstPage ? 1 : this.currentPage - 1;
  }

  get nextPage() {
    return this.isLastPage ? this.props.totalPages : this.currentPage + 1;
  }

  get isFirstPage() {
    return this.currentPage === 1;
  }

  get isLastPage() {
    return this.currentPage === this.props.totalPages;
  }

  get currentPage() {
    return this.props.currentPage || this.state.currentPage;
  }

  get leftRange() {
    const { marginPages, pageRange } = this.props;

    return {
      begin: 0,
      end: marginPages + pageRange - TRUNCATE_LENGTH
    };
  }

  get rightRange() {
    const { totalPages, marginPages, pageRange } = this.props;

    return {
      begin: totalPages - (marginPages + pageRange - TRUNCATE_LENGTH),
      end: totalPages
    };
  }

  getPageProps = ({ page, onClick, ...props }, passPageProp) => ({
    onClick: composeEventHandlers(onClick, () => this.selectPage(page)),
    page: passPageProp ? page : undefined,
    ...props
  });

  selectPage = page => {
    if (this.props.currentPage === undefined) {
      this.setState({ currentPage: page });
    }

    this.props.onSelect && this.props.onSelect(page);
  };
}

const valuesFromRange = (length, offset = 0) =>
  Array.from({ length }, (_, index) => offset + index + 1);

const composeEventHandlers = (...fns) => (event, ...args) =>
  fns.some(fn => {
    fn && fn(event, ...args);
    return event.defaultPrevented;
  });
