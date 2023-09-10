import { HandPalm, Play } from 'phosphor-react'
import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from './style'
// importando o zod e o resolver:
import { useEffect, useState } from 'react'
import NewCycleForm from './NewCycleForm'
import { CountdownContainer } from './Countdown/style'

interface Cycle {
  id: string
  task: string
  minuteAmount: number
  startDate: Date
  interruptDate?: Date
  finishDate?: Date
}

export function Home() {
  // criando um estado para armazenar os dados de ciclo.
  const [cycles, setCycles] = useState<Cycle[]>([])
  // criando um estado para armazenar os dados do ciclo ativo;
  const [activeCycleId, setActiveCycleID] = useState<string | null>()

  const activeCycle: Cycle | undefined = cycles.find(
    (cycle) => cycle.id === activeCycleId,
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onSubmitForm(data: newCycleFormData, event: any) {
    event.preventDefault()
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minuteAmount: data.minuteAmount,
      startDate: new Date(),
    }

    setCycles((prevState) => [...prevState, newCycle])
    setActiveCycleID(newCycle.id)
    setAmountSecondsPassed(0)

    reset()
  }

  function handleInterruptCycle() {
    cycles.map((cycle) => {
      if (cycle.id === activeCycleId) {
        return { ...cycle, interruptDate: new Date() }
      } else {
        return cycle
      }
    })
    setActiveCycleID(null)
  }

  // iniciando logica do countdown:
  // Se tiver algum ciclo ativo, vai retornar a quantidade de segundos daquele ciclo.
  // Se nao(caso a tela esteja iniciando ou o tenha recarregado, retorna 0)

  // criando uma variável para pegar a quantidade atual de segundos:
  const currentSeconds: number = activeCycle
    ? totalSeconds - amountSecondsPassed
    : 0

  // criando uma variavel para armazenar a quantidade atual em minutos:
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  // construindo a logica de minutos(metodo padstart=> preenche a string com algum caracter quando ela nao
  // tiver esse tamanho minimo);
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  function onSubmitError(err: unknown) {
    console.log(err)
  }

  // alterando o title da pagina:
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds])

  // pegando erros:
  console.log(formState)

  // criando um "observable" no input task
  const task = watch('task')
  // Com o método watch, podemos ficar observando as mudanças
  // no valor de inputs, para criar validações condicionais
  // como fizemos com o disabled.
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      {/* //Ja quanto ao handleSubmit do useForm(),
//repare que passamos para ele como parametro, a nossa função
//de submit do formulário. Ele basicamente, vai retornar essa função
//passando como parametro para ela, o formGroup do formulário:
//onSubmit={handleSubmit(onSubmitForm)}
//data: { nome: "Eduardo" }
//por padrão, esses dados vem como string, mas podemos passar um objeto
//de configuração para fazer um parse desses dados:

//{...register('minuteAmount', { valueAsNumber: true })} */}
      <form action="" onSubmit={handleSubmit(onSubmitForm, onSubmitError)}>
        {/* //Ja quanto ao handleSubmit do useForm(),
//repare que passamos para ele como parametro, a nossa função
//de submit do formulário. Ele basicamente, vai retornar essa função
//passando como parametro para ela, o formGroup do formulário:
//onSubmit={handleSubmit(onSubmitForm)}
//data: { nome: "Eduardo" }
//por padrão, esses dados vem como string, mas podemos passar um objeto
//de configuração para fazer um parse desses dados: */}
        <NewCycleForm />
        <CountdownContainer activeCycle={activeCycle} setCycles={setCycles} activeCycleId={activeCycleId} />

        {activeCycle ? (
          <StopCountDownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountDownButton>
        ) : (
          <StartCountDownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
