import { Card, Col, message, Row, Table } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { post } from '@/utils/request'
import { uuidv4 } from '@antv/xflow'
interface IProperties {}

const Manage: React.FC<IProperties> = ({}): React.ReactElement => {
  const pagination = {
    current: 1,
    pageSize: 30,
  }
  const optionVerify = {
    title: {
      text: '验证实验',
      x: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      // data: ['低于60分', '60分-70分', '70分-80分', '80分-90分', '90-100分'],
    },
    series: [
      {
        name: '人数分布',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  const optionAutonomous = {
    title: {
      text: '自主实验',
      x: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',

    },
    series: [
      {
        name: '人数分布',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  const [verifyData, setVerifyData] = useState({})
  const [autonomousData, setAutonomousData] = useState({})
  const [gradeData, setGradeDate] = useState([])
  const [loading, setLoading] = useState(false)
  const getType = (grade) => {
    grade = parseFloat(grade)
    if (grade < 60) return '低于60分'
    else if (grade >= 60 && grade < 70) return '60分-70分'
    else if (grade >= 70 && grade < 80) return '70分-80分'
    else if (grade >= 80 && grade < 90) return '80分-90分'
    else if (grade >= 90 && grade < 100) return '90分-100分'
  }
  const columns = [
    {
      title: '学号',
      dataIndex: 'stuId',
    },
    {
      title: '验证实验成绩',
      dataIndex: 'grade2',
      sorter: (a, b) => a.grade2 - b.grade2,
    },
    {
      title: '自主实验成绩',
      dataIndex: 'grade1',
      sorter: (a, b) => a.grade1 - b.grade1,
    },
  ]
  useEffect(() => {
    if (!Array.prototype.hasOwnProperty('count')) {
      Object.defineProperties(Array.prototype, {
        count: {
          value: function (value) {
            return this.filter((x) => x == value).length
          },
        },
      })
    }

    let obj = {
      url: '/api/grade/selectAll',
      params: {
        teaId: sessionStorage.getItem('id') || 0,
      },
    }
    post(obj).then((res) => {
      if (res.data.message === 'ok') {
        const grades: any[] | ((prevState: never[]) => never[]) = []
        const grade1Arr = []
        const grade2Arr = []
        const grade1ArrCount = []
        const grade2ArrCount = []
        res.data.data.forEach((item) => {
          grades.push(item)
          // console.log('previousValue',getType(item.grade1))
          grade1ArrCount.push(getType(item.grade1))
          grade2ArrCount.push(getType(item.grade1))
        })
        grade1ArrCount.forEach((r, index) => {
          if (grade1ArrCount.count(r) >= 1 && grade1ArrCount.indexOf(r) === index) {
            grade1Arr.push({
              name: r,
              value: grade1ArrCount.count(r),
            })
          }
        })
        grade2ArrCount.forEach((r, index) => {
          if (grade2ArrCount.count(r) >= 1 && grade2ArrCount.indexOf(r) === index) {
            grade2Arr.push({
              name: r,
              value: grade2ArrCount.count(r),
            })
          }
        })
        setGradeDate(grades)
        optionVerify.series[0].data = grade2Arr
        optionAutonomous.series[0].data= grade1Arr
        console.log("optionAutonomous.series[0].data",optionAutonomous.series[0].data)
        setVerifyData({
          ...optionVerify,
        })
        setAutonomousData({
          ...optionAutonomous,
        })
      } else {
        message.error(res.data.message)
      }
    })
  }, [])
  return (
    <div>
      <Card style={{ marginTop: 16 }} title="成绩分布图">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card style={{ marginTop: 16 }} type="inner" title="验证实验">
              <ReactECharts option={verifyData} style={{ height: 400 }} />
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ marginTop: 16 }} type="inner" title="自主实验">
            <ReactECharts option={autonomousData} style={{ height: 400 }} />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: 16 }}  title="成绩一览" >
      <Table 
          columns={columns}
          rowKey={(record) => uuidv4()}
          dataSource={gradeData}
          pagination={pagination}
          loading={loading}
        />
      </Card>
    </div>
  )
}

export default memo(Manage)
