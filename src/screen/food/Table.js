import React, { Component } from 'react'
import {
  PixelRatio, StyleSheet,
  View,
  ScrollView,
  Text
} from 'react-native'
import PropTypes from 'prop-types'

const DEFAULT_HEIGHT = 240;
const DEFAULT_COLUMN_WIDTH = 60;
var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}

class Table extends Component {

  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
      dataIndex: PropTypes.string.isRequired,
      width: PropTypes.number
    })).isRequired,
    columnWidth: PropTypes.number,
    height: PropTypes.number,
    dataSource: PropTypes.array.isRequired,
    renderCell: PropTypes.func,
  };

  static defaultProps = {
    columns: [],
    dataSource: [],
    columnWidth: DEFAULT_COLUMN_WIDTH,
    height: DEFAULT_HEIGHT,
    renderCell: undefined
  };

  _renderCell(cellData, col, isLast) {
    let style = {paddingLeft:col.textLeft?5:0, alignItems:col.textLeft?"flex-start":"center", width: col.width || this.props.columnWidth || DEFAULT_COLUMN_WIDTH, borderLeftWidth: col.isFirst? 1: 0, borderLeftColor:"#dfdfdf"};
    return (
      <View key={col.dataIndex} style={[styles.cell, style]}>
        <Text style={{fontSize:FONT_BACK_LABEL*0.6}}>{cellData=="확인불가"?"잘모르겠어요":cellData}{col.lastTxt && col.lastTxt}</Text>
      </View>
    )
  }

  _renderHeader() {
    let { columns, columnWidth } = this.props;
    return columns.map((col, index) => {
      let style = {width: col.width || columnWidth || DEFAULT_COLUMN_WIDTH, borderLeftWidth: col.isFirst? 1: 0, borderLeftColor:"#dfdfdf" };
      return (
        <View key={index} style={[styles.headerItem, style]}>
          <Text style={{textAlign:"center",fontSize:FONT_BACK_LABEL*0.7}}>{col.title}</Text>
        </View>
      )
    })
  }

  _renderRow(rowData, index) {
    let { columns, renderCell } = this.props;
    var isLast = false;
    if(!renderCell) {
      renderCell = this._renderCell.bind(this, );
    }
    if (this.props.dataSource.length === index + 1) {
      isLast = true;
    }
    return (
      <View key={index} style={[styles.row,{borderBottomColor:isLast? "#000000":"#dfdfdf"}]}>
        {
          columns.map((col,idx) => {
            //console.log(rowData.foodId);
            //console.log(col.dataIndex);
            var data = rowData[col.dataIndex];
            if(rowData.foodId==4909&&col.dataIndex=="food.foodNm"){
              data="잘모르겠어요";
            }
            //console.log(rowData);
            if(col.dataIndex=="food.foodNm"&&rowData[col.dataIndex]&&rowData[col.dataIndex]!=""){
              if(rowData.food){
                if(rowData.food.foodCategory&&rowData.food.foodCategory!=''&&(rowData.food.foodCategory.indexOf("음료")>-1||rowData.food.foodCategory.indexOf("우유")>-1)){
                  data +="("+rowData.food.servingSize+"ml)";
                }else{
                  data +="("+rowData.food.servingSize+"g)";
                } 
              }else{
                if(rowData.foodCategory&&rowData.foodCategory!=''&&(rowData.foodCategory.indexOf("음료")>-1||rowData.foodCategory.indexOf("우유")>-1)){
                  data +="("+rowData.servingSize+"ml)";
                }else{
                  data +="("+rowData.servingSize+"g)";
                } 
              }
              if(rowData.amountDish>1){
                data += 'x'+rowData.amountDish;
              }
            }
            return(renderCell(data, col))
          })
        }
      </View>
    );
  }

  render() {
    let { dataSource, height } = this.props;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer , { height }]}
        horizontal={true}
        bounces={false} >
        <View style={{borderTopWidth:1, borderBottomWidth:0, borderLeftWidth:0, borderTopColor:"#000000", borderBottomColor:"#000000", borderLeftColor:"#dfdfdf", borderRightColor:"#dfdfdf"}}>
          <View style={styles.header}>
            { this._renderHeader() }
          </View>
          <ScrollView
            style={styles.dataView}
            contentContainerStyle={styles.dataViewContent} >
            { dataSource.map((rowData, index) => this._renderRow(rowData, index)) }
          </ScrollView>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
  contentContainer: {
    height: 240
  },
  header: {
    flexDirection: 'row',
  },
  headerItem: {
    minHeight: 30,
    width: DEFAULT_COLUMN_WIDTH,
    backgroundColor: '#efefef',
    borderRightWidth: 1,
    borderRightColor: '#dfdfdf',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dataView: {
    flexGrow: 1,
  },
  dataViewContent: {
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fbfbfb',
    borderBottomWidth: 1,
    borderBottomColor: '#dfdfdf',
  },
  cell: {
    minHeight: 25,
    width: DEFAULT_COLUMN_WIDTH,
    backgroundColor: 'transparent',
    borderRightWidth: 1,
    borderRightColor: '#dfdfdf',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
});

export default Table