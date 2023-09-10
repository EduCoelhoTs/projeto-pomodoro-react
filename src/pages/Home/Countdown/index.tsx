import { useEffect, useState } from 'react'
import { CountdownContainer, Separator } from './style'

export default function Countdown() {
  // criando estado para quantidade de segundos passados:
  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0)

  const totalSeconds: number = activeCycle ? activeCycle.minuteAmount * 60 : 0

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        // setando a quantidade de segundos passados. Utilizando método do date-fns
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )
        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishDate: new Date() }
              } else {
                return cycle
              }
            }),
          )
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }
    // criando um onDestroy(fluxo que sera executado quando o componente for destruido)
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
