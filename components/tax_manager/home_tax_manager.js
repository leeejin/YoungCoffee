import React, { Component } from "react";
import { Container, Table } from "react-bootstrap";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DownloadIcon from '@mui/icons-material/Download';

import MyStorage from '../../util/redux_storage';

import WebServiceManager from "../../util/webservice_manager";
import Constant from "../../util/constant_variables";
import PageHeader from "../../util/page_header";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ModalTaxDetail from '../tax_manager/modal_tax_detail';

import Pagenation2 from "../../util/pagenation2";

import { ko } from "date-fns/esm/locale";
import DatePicker from "react-datepicker";
export default class TaxManager extends Component {
    constructor(props) {
        super(props);

        this.settleKind = Constant.getSettleKind();

        this.itemCountPerPage = 13; //한페이지당 보여질 리스트 갯수
        this.pageCountPerPage = 5;  //페이지는 5페이지로 제한

        this.contents = []; //서버에서 가져온 원본 contents

        this.state = {
            modalVisible: false, //상세보기

            taxContents: [], //가맹점 리스트 
            item: {},

            isSettleComplete: this.settleKind[0].value, //마감여부 드롭박스 All:전체 , 0:마감전 , 1:마감완료

            searchText: '',

            //페이지 관련
            currentPage: 1,      // 현재 페이지 (setCurrentPage()에서 변경됨)
            offset: 0,            //현재페이지에서 시작할 item index
            month:2,  // 필터링 할 개월
        }
    }

    componentDidMount() {    
        this.getSettledList();
    }

    getSettledList=()=> {
        this.callGetSettledListAPI().then((response)=> {
            this.contents = response;
            this.setState({ taxContents: this.contents });
        });
    }
   
    //지점별 정산/미정산 리스트 호출 
    //호출 url뒤에 ?how_long=5라고 하면 현재부터 5개월전까지 호출
    //즉 현재가 8월이면 3월부터 8월
    async callGetSettledListAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/admin/GetSettledList?how_long="+this.state.month);
        let response = await manager.start();
        if (response.ok)
            return response.json();

    }


    //프로젝트 리스트에서 하나의 아이템을 선택하면 DetailPopup창을 띄우고 현재 선택된 아이템의 index 설정
    onItemClickListener = (item) => {
        this.setState({
            modalVisible: !this.state.modalVisible,
            item: item
        });
    }

    closeModalListener=()=> {
        this.setState({modalVisible:false});
    }


    //Pagenation에서 몇페이지의 내용을 볼지 선택 (페이지를 선택하면 현재의 페이지에따라 offset 변경)
    setCurrentPage = (page) => {
        let lastOffset = (page - 1) * this.itemCountPerPage;
        this.setState({ currentPage: page, offset: lastOffset });
    };


    //가맹점명으로 검색
    searchTextListener = (text) => {
        this.setState({ searchText: text })
        this.setState({ taxContents: this.dataFiltering(text, this.state.isSettleComplete) })
    }

    //정산여부리스너
    selectSettleKindListener = (value) => {
        //console.log(this.approval)
        this.setState({ isSettleComplete: value })
        this.setState({ taxContents: this.dataFiltering(this.state.searchText, value) })
    }

    dataFiltering(text, settleKind) {       
        let filteredContents = this.contents;

        //가맹점명으로 검색
        filteredContents = filteredContents.filter((item) => {
            //console.log('keyword: ', text)
            if (item.cmpName.includes(text))
                return true;
        });

        //정산 또는 미정산 선택시 필터링
        filteredContents = filteredContents.filter((item) => {
            if (settleKind === this.settleKind[0].value)
                return true;
            else
                return item.complete === settleKind;
        });

        return filteredContents;
    }


    //이번달, 3개월, 5개월 버튼 함수
    dateButtonClicked=(value)=>{
        this.setState({month:value},()=>{
            this.callGetSettledListAPI().then((response)=> {
                this.contents = response;
                this.setState({ taxContents: this.dataFiltering(this.state.searchText, this.state.isSettleComplete) });
            });
          
        })
        
    }
   
    render() {
        return (
            <Container>
                {/* 서브탑메뉴바 영역 */}
                <nav className="topcontents topmenubar w-100">
                    <div className="d-flex topmenubar">
                        <Box style={{ marginRight: '15px' }} sx={{ minWidth: 190 }} >
                            <FormControl fullWidth>
                                <InputLabel>마감여부</InputLabel>
                                <Select
                                    value={this.state.isSettleComplete}
                                    label="마감여부"
                                    onChange={(e) => this.selectSettleKindListener(e.target.value)}>
                                    {this.settleKind.map((item, i) => <MenuItem value={item.value} key={i}>{item.title}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Box>
                        <div className="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" className={this.state.month==0?"btn btn-outline-dark active":"btn btn-outline-dark"} onClick={()=>{this.dateButtonClicked(0)}}>이번달</button>
                                    <button type="button" className={this.state.month==2?"btn btn-outline-dark active":"btn btn-outline-dark"} onClick={()=>{this.dateButtonClicked(2)}}>3개월</button>
                                    <button type="button" className={this.state.month==4?"btn btn-outline-dark active":"btn btn-outline-dark"} onClick={()=>{this.dateButtonClicked(4)}}>5개월</button>
                                
                            </div>
                    </div>
                  
                    
                    <PageHeader searchTextListener={(text) => this.searchTextListener(text)} />
                </nav>

                {this.state.modalVisible && <ModalTaxDetail item={this.state.item} closeButtonListener={this.closeModalListener} onRefresh={this.getSettledList}/>}

                {/* 테이블 영역 */}
                <div className="middlecontents">
                    <Table hover>
                        <thead>
                            <tr>
                                <th>년-월</th>
                                <th>가맹점 명</th>
                                <th>주소</th>
                                <th>전화번호</th>
                                <th>마감여부</th>
                                <th>다운로드</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 튜플영역을 map을 사용하여 하나씩 받아와 뿌려주도록 구성함 */}
                            {
                                this.state.taxContents.length === 0 ? <tr><td colSpan={6}>비었습니다.</td></tr> : <>

                                    {/* 튜플영역을 map을 사용하여 하나씩 받아와 뿌려주도록 구성함 */}
                                    {
                                        this.state.taxContents.slice(this.state.offset, this.state.offset + this.itemCountPerPage).map((item, i) =>
                                            <ListItem item={item} key={i} onClicklistener={(item) => this.onItemClickListener(item)} />)
                                    }

                                </>
                            }
                        </tbody>
                    </Table>
                </div>
                <div className="bottomcontents m-2">
                    {this.state.taxContents.length > 0 && (
                        <Pagenation2 itemCount={this.state.taxContents.length} pageCountPerPage={this.pageCountPerPage} itemCountPerPage={this.itemCountPerPage} currentPage={this.state.currentPage} clickListener={this.setCurrentPage} />
                    )}</div>
            </Container>
        );
    }
}


//--------------------------------------------------------------------------------------------------------
// 테이블에 데이터를 뿌려주는 클래스
class ListItem extends Component {
    constructor(props) {
        super(props);
    }

    //리스트에서 다운로드 아이콘 클릭시
    onDownloadClicked = (e) => {
        e.stopPropagation(); //이거 없애면 상위모달도 같이 클릭됨
        if (window.confirm("다운로드하시겠습니까?")) {
            if (this.props.item.complete == 1) {
                const element = document.createElement('a');
                const url = Constant.serviceURL + "/admin/GetSettledExcel?user_id=" + this.props.item.userID + "&day=" + this.props.item.belongDate;
                console.log('excel down url = ', url);
                element.href = url;
                document.body.appendChild(element);
                element.click();
            }
        }

    }

    //리스트를 선태했을 경우
    onClickListener = () => {
        this.props.onClicklistener(this.props.item);
    }

    render() {
        const item = this.props.item;
        return (
            <tr onClick={this.onClickListener}>
                <td>{item.belongDate}</td>
                <td>{item.cmpName}</td>
                <td>{item.cmpAddress}</td>
                <td>{item.cmpTel}</td>
                {/* 0:미정산, 1:정산 */}
                {item.complete >0
                    ? (<>
                        <td>O</td>
                        <td><DownloadIcon className="downloadButton" onClick={(e) => this.onDownloadClicked(e)} /></td>
                    </>)
                    : (<>
                        <td>X</td>
                        <td> </td>
                    </>)
                }

            </tr>
        )

    }
}