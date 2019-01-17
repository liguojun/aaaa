import React, { Component } from "react";
import "./BookDetails.css";

class BookDetails extends Component {
  constructor(props){
    super(props);
  }


render() {
  const { book } = this.props;

  return (
    <div className="bookDetails">
      <div>题名：<span>{book.title}</span></div>
      <div>著者：<span>{book.author}</span></div>
      <div>出版社：<span>{book.publisherName}</span></div>
      <div>出版年：<span>{book.yearOfPublication}</span></div>
      <div>附注：<span>{book.extent}</span></div>
      <div>索书号：<span>{book.baseCallNumber}</span></div>
      {book.ISBN=="" ? '':<div>ISBN：<span>{book.ISBN}</span></div>}

      {(book.CallInfo || []).map((item, index) => (
        <div className="bookDetailsTable" key={'book_callinfo_'+index}>
          <div>馆藏：<span>{item.libraryID}</span></div>
          <div className="table">
            <div className="table-tr">
                <div className="table-th">索书号</div>
                <div className="table-th">复本号</div>
                <div className="table-th">馆藏类型</div>
                <div className="table-th">馆藏位置</div>
            </div>
            {(item.ItemInfo || []).map((item2, index2) => (
              <div className="table-tr" key={item2.itemID}>
                  <div className="table-td-1">{index2==0?item.callNumber:''}</div>
                  <div className="table-td-2">{index2+1}</div>
                  <div className="table-td-3">{item2.itemTypeID}</div>
                  <div className="table-td-4">{item2.currentLocationID}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    );
  }

}

export default BookDetails;
