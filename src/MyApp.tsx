import React, { useRef } from "react";
import "./App.css";
import { useEffect } from "react";
import { useState } from "react";
import Color from "color";
import { monday } from "./Infrastructure/monday";
import Divider from "antd/lib/divider";
import { IData } from "./Infrastructure/Interfaces/IData";
import { ISettings } from "./Infrastructure/Interfaces/ISettings";
import { Button, InputNumber, Space, Table } from "antd";

interface IMyAppProps { }

const MyApp: React.FC<IMyAppProps> = (props) => {
  const [bg, setBg] = useState<Color>(Color("#00ca72"))
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const [data, setData] = useState<IData>({ me: { name: "Stranger" } });

  const [selectedBoards, setSelectedBoards] = useState<any[]>([]);
  const [selectedBoardColumns, setSelectedBoardColumns] = useState<any[]>([]);

  const [isTableLoading, setIsTableLoading] = useState<boolean>();

  const boardIdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSettings();
    getMe();
    const firstname = "Joe";
    const lastname = "Doe";
    const fullname = firstname + '||' + lastname;
    console.log(fullname)
  }, [])



  const getSettings = () => {
    monday.listen("settings", (res) => {
      var setting: ISettings = res.data;

      setting.background && setBg(Color(setting.background));
      setting.date && setSelectedDate(new Date(setting.date));
    });
  }

  const getMe = () => {
    monday.api(`query { me { name } }`)
      .then((res) => {
        if (res) {
          var tempData: IData = res.data as IData;
          tempData.me && setData({ me: { name: tempData.me.name } });
        }
      });
  }

  const getBoardDetail = (id: string) => {
    if (!id) return;
    setIsTableLoading(true);
    setSelectedBoardColumns([])
    setSelectedBoards([])

    monday.api(
      `query {  
        boards (ids: ${id}) {
          name
          state
          columns {
            title
            type
          }  
          board_folder_id
          items {
            id
            name
            column_values {
              text
            }
          }
        }
      }`)
      .then(res => {
        const temp = (res.data as any).boards;
        res && setSelectedBoardColumns(createBoardColumns(temp[0].columns));
        res && setSelectedBoards(temp);
        setIsTableLoading(false);
      })
      .catch(er => setIsTableLoading(false))
  }

  const varToString = (varObj: {}) => Object.keys(varObj)[0]

  const createBoardColumns = (rawBoardColumns: any[]) => {
    const resultColumns = rawBoardColumns && rawBoardColumns.map((rawColumn: any) => ({
      title: rawColumn.title,
      dataIndex: rawColumn.title,
      key: rawColumn.title,
    }))
      .filter(x => x.title != `Subitems`);
    resultColumns.splice(0, 0, { title: "id", dataIndex: "id", key: "id" });
    return resultColumns;
  }

  const createBoardValues = (boardColumns: any[], rawBoardValues: any) => {
    const boardValuesResult = rawBoardValues.map((rawBoardValue: any) =>
      rawBoardValue.column_values.map((rawValue: any, i: number) => ({
        [`${boardColumns[i].title}`]: rawValue.text
      })))

    return boardValuesResult.map((res: any) => res.reduce((result: any, item: any) => {
      var key = Object.keys(item)[0];
      result[key] = item[key];
      return result;
    }, {}));

  }

  return (
    <div className="App" style={{ background: bg.hex() }} >
      <Space className="centered">
        <span>Hello, {data.me.name}!</span>
        <Divider type="vertical" />
        <span>Selected date: {selectedDate.toDateString()}!</span>
      </Space>
      <Divider type="horizontal" />
      <Space className="centered">
        Board Id:
        <InputNumber style={{ minWidth: 200 }} ref={boardIdRef} />
        <Button onClick={() => getBoardDetail(boardIdRef.current!.value)}>Search</Button >
      </Space>
      <Divider type="horizontal" />
      <Space>
        {selectedBoards && selectedBoards.length > 0 &&
          <Table columns={selectedBoardColumns} dataSource={createBoardValues(selectedBoardColumns, selectedBoards[0].items)} size="small" loading={isTableLoading} />}
      </Space>
    </div>
  );
}

export default MyApp;
