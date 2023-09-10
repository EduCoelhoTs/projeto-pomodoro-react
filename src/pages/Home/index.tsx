import { HandPalm, Play } from 'phosphor-react'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountDownButton,
  StopCountDownButton,
  TaskInput,
} from './style'
import { useForm } from 'react-hook-form'
// importando o zod e o resolver:
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

interface Cycle {
  id: string
  task: string
  minuteAmount: number
  startDate: Date
  interruptDate?: Date
  finishDate?: Date
}

interface newCycleFormData {
  task: string
  minuteAmount: number
  startDate: Date
}

// criando um schema de validação:
// repare, que usamos zod.object => isso ocorre, por que o formulário retorna um objeto(task: '', minutesAmount: number)
// em cada chave do objeto, será passado a regra de validação e suas mensagens de erro:
const newCycleValidationSchema = zod.object({
  // Repare que toda validação, de valores, recebe o valor, e a mensagem de erro opcional como parametro.
  task: zod.string().min(1, 'Informa a tarefa'),
  minuteAmount: zod.number().min(5).max(60, 'O valor maximo deve ser 60'),
})

export function Home() {
  // criando um estado para armazenar os dados de ciclo.
  const [cycles, setCycles] = useState<Cycle[]>([])
  // criando um estado para armazenar os dados do ciclo ativo;
  const [activeCycleId, setActiveCycleID] = useState<string | null>()
  // criando estado para quantidade de segundos passados:
  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0)

  // Criando estrutura inicial do formulário
  const { register, handleSubmit, watch, formState, reset } =
    useForm<newCycleFormData>({
      resolver: zodResolver(newCycleValidationSchema),
      defaultValues: {
        task: '',
        minuteAmount: 0,
      },
    })
  // A função useForm, recebe um resolver, que sera um metodo, que por sua vez receberá um schema de validação, com
  // o formato dos dados do objeto do formulário, junto das validações que ele deve ter;

  const activeCycle: Cycle | undefined = cycles.find(
    (cycle) => cycle.id === activeCycleId,
  )

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
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            disabled={!!activeCycle}
            id="task"
            list="task-sugestion"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />

          {/* //Repare que foi feito um spread, da função register
//passando uma string. A string, nada mais é do que o
//nome do nosso input no formulário.
//Já o spread, ocorre por que a função register retorna
//um objeto, com diversos atributos e métodos desse elemento
///input:
/// function register(nomeInput: string) {
///      return {
///         onChange: () => void
///         onBlur: () => void
///         max: number
///   ...etc
///E o spread serve para passar esses atributos para o input */}

          {/* criando uma lista de sugestões nativa com HTML => Referencia a lista no input */}

          <datalist id="task-sugestion">
            <option value="Projeto alpha" />
            <option value="Projeto beta" />
            <option value="Projeto gama" />
            <option value="Projeto teta" />
          </datalist>

          <label htmlFor="minuteAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minuteAmount"
            disabled={!!activeCycle}
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minuteAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

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
