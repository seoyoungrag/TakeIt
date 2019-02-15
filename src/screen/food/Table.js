import React, { Component } from 'react'
import {
  PixelRatio, StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  ScrollView,
  Text
} from 'react-native'
import PropTypes from 'prop-types'
import Prompt from 'rn-prompt';
import cFetch from "@common/network/CustomFetch";
import APIS from "@common/network/APIS";

import Entypo from 'react-native-vector-icons/Entypo';
const {width, height} = Dimensions.get("window");


const DEFAULT_HEIGHT = 240;
const DEFAULT_COLUMN_WIDTH = 60;
var FONT_BACK_LABEL   = 16;
if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 12;
}
function isInt(n){
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
  return Number(n) === n && n % 1 !== 0;
}
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amountDish: 0,
      promptVisible: false,
      photoFoodDetailId: 0,
      dataSource: []
    }
  }
  componentDidMount(){
    this.setState({dataSource:this.props.dataSource});
  }

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
    var data = cellData;
    if(isFloat(cellData)){
      data = data.toFixed(1);
    }
    return (
      <View key={col.dataIndex} style={[styles.cell, style]}>
        <Text style={{fontSize:FONT_BACK_LABEL*0.6}}>{data=="확인불가"?"잘모르겠어요":data}{col.lastTxt && col.lastTxt}</Text>
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

  _renderHeaderTop(dataSource) {
    let columns = [
      { 
        title: "이름",
        width: this.props.parentWidth*(0.135+0.06)
        //isFirst: true
      }, 
      { 
        dataIndex: "foodNm",
        width: (this.props.parentWidth*(0.135+0.06))+(this.props.parentWidth*(0.11+0.06))
      }, 
      { 
        title: "섭취량",
        width:this.props.parentWidth*(0.135+0.06)
      },
      { 
        dataIndex: "amountDish",
        width: this.props.parentWidth*(0.082+0.06)
      }
    ];
    return columns.map((col, index) => {
      let style = {width: col.width, borderLeftWidth: col.isFirst? 1: 0, borderLeftColor:"#dfdfdf" };
      var title = col.title;
      var photoFoodDetailId = 0;
        dataSource.map((rowData, index) => {
          title = title? title : rowData[col.dataIndex] ;
          if(title=='섭취량'){
            //console.warn(photoFoodDetailId);
            photoFoodDetailId = rowData['photoFoodDetailId'];
          }
          if(col.dataIndex=='foodNm'){
            title = title=="확인불가"?"잘모르겠어요":title;
            var foodServingSize = rowData['foodServingSize']
            if(foodServingSize.servingSizeNm && foodServingSize.servingSizeNm !=''){
              title = foodServingSize.food.foodNm;
              title = title=="확인불가"?"잘모르겠어요":title;
              title += "("+foodServingSize.servingSizeNm+")";
            }else if(foodServingSize.grams&&foodServingSize.grams!='' &&foodServingSize.gramsUnit&&foodServingSize.gramsUnit!='' ){
              title += "("+foodServingSize.grams+foodServingSize.gramsUnit+")";
            }
          }else if(col.dataIndex=='amountDish'){
            title = String(title);
          }
        });
      //console.warn(photoFoodDetailId);
      //console.warn(title +' '+ photoFoodDetailId);
      return title=='섭취량' && photoFoodDetailId && photoFoodDetailId!=0? 
      (
      <TouchableOpacity onPress={() => this.setState({ promptVisible: true, photoFoodDetailId: photoFoodDetailId })} >
        <View key={index} style={[!col.title? styles.cell: styles.headerItem, style]}>
          <Text style={{textAlign:"center",fontSize:FONT_BACK_LABEL*0.7}}>{title}
          &nbsp;<Entypo
            name="pencil"
            color={"#000000"}
            size={FONT_BACK_LABEL*0.7}
            borderWidth={0}/>
          </Text>
        </View>
      </TouchableOpacity> 
      ) : 
      (
      <View key={index} style={[!col.title? styles.cell: styles.headerItem, style]}>
        <Text style={{textAlign:"center",fontSize:FONT_BACK_LABEL*0.7}}>{title}</Text>
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
    //if (this.props.dataSource.length === index + 1) {
    if (this.state.dataSource.length === index + 1) {
      isLast = true;
    }
    return (
      <View key={index} style={[styles.row,
      //{borderBottomColor:isLast? "#000000":"#dfdfdf"}
      {borderBottomColor:"#dfdfdf", borderBottomWidth:1}
      ]}>
        {
          columns.map((col,idx) => {
            //console.log(rowData.foodId);
            //console.log(col.dataIndex);
            var data = rowData[col.dataIndex];
            if(rowData.foodId==4986&&col.dataIndex=="food.foodNm"){
              data="잘모르겠어요";
            }
            //console.log(rowData);
            /*
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
            */
            return(renderCell(data, col))
          })
        }
      </View>
    );
  }

  render() {
    //let { dataSource, height } = this.props;
    let { height } = this.props;
    let { dataSource } = this.state;
    const COM = this;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer , { height }]}
        horizontal={true}
        bounces={false} >
        <Prompt
            title="변경할 섭식량을 입력해주세요."
            placeholder="숫자만 입력해주세요"
            defaultValue="1"
            textInputProps={{keyboardType: 'numeric',autoCapitalize:'words'}}
            
            visible={this.state.promptVisible}
            onCancel={() => this.setState({ promptVisible: false, amountDish: 0, photoDetailId: 0 })}
            onSubmit={async (value) => {
              value = Number(value);
              /*
              if(isInt(value) || isFloat(value)){
                alert('숫자맞다.');
              }else{
                alert('숫자아니다.')
              }
              */
             //console.warn(value);
              var foodAnalysisInfo = {};
              foodAnalysisInfo.photoFoodDetailId = this.state.photoFoodDetailId;
              foodAnalysisInfo.amountDish = value;
              foodAnalysisInfo.userId = this.props.userId;
              var body = JSON.stringify(foodAnalysisInfo);
              //console.warn(body);
              await cFetch(APIS.PUT_FOOD_ANALYSIS_AMOUNTDISH, [], body, {
                responseProc: function(res) {
                  console.log(res);
                  var arry = [res];
                  COM.setState({
                    dataSource: arry
                  })
                },
                //입력된 회원정보가 없음.
                responseNotFound: function(res) {
                  console.warn(res);
                }
              });
              this.setState({ promptVisible: false, amountDish: value })}
              }/>

        {this.state.dataSource ? (    
        <View style={{borderTopWidth:1, borderBottomWidth:0, borderLeftWidth:1, borderTopColor:"#000000", borderBottomColor:"#000000", borderLeftColor:"#dfdfdf", borderRightColor:"#dfdfdf"}}>
          <View style={[styles.header,{borderBottomColor:"#dfdfdf", borderBottomWidth:1}]}>
            { this._renderHeaderTop(dataSource) }
          </View>
          <View style={styles.header}>
            { this._renderHeader() }
          </View>
          <ScrollView
            style={styles.dataView}
            contentContainerStyle={styles.dataViewContent} >
            { dataSource.map((rowData, index) => this._renderRow(rowData, index)) }
          </ScrollView>
        </View>
        ): null}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor:"#dfdfdf", borderBottomWidth:1
  },
  contentContainer: {
    height: 90
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
    flexGrow: 1
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