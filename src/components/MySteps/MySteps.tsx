import React, { useState } from 'react'
import { Steps, Button, message } from 'antd'

const { Step } = Steps

interface StepShape {
  title: string
  content?: string
}

const steps: Array<StepShape> = [
  {
    title: 'First',
    content: 'First-content'
  },
  {
    title: 'Second',
    content: 'Second-content'
  },
  {
    title: 'Last',
    content: 'Last-content'
  }
]

const MySteps: React.FC = () => {
  const [current, setCurent] = useState(0)

  function handleNext(): void {
    setCurent(current => current + 1)
  }

  function handleRfresh(): void {
    setCurent(0)
  }

  return (
    <>
      <Steps current={current}>
        {steps.map(step => (
          <Step key={step.title} title={step.title} />
        ))}
      </Steps>
      {current < steps.length - 1 && (
        <Button onClick={handleNext} style={{ marginTop: 50 }} type='primary'>
          Next
        </Button>
      )}
      {current >= steps.length - 1 && (
        <Button
          onClick={() => message.success('Processing complete!')}
          style={{ marginTop: 50 }}
          type='primary'
        >
          Done
        </Button>
      )}
      {current > 0 && (
        <Button
          onClick={handleRfresh}
          style={{ marginTop: 50, marginLeft: 10 }}
          type='primary'
        >
          Rfresh
        </Button>
      )}
    </>
  )
}

export default MySteps
