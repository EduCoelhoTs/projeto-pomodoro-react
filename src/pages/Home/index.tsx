import { Play } from 'phosphor-react'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountDownButton,
  TaskInput,
} from './style'
import { useForm } from 'react-hook-form'
// importando o zod e o resolver:
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { FormEvent } from 'react'

interface newCycleFormData {
  task: string
  minuteAmount: number
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

  function onSubmitForm(data: newCycleFormData, event: any) {
    event.preventDefault()
    console.log(data)
    reset()
  }

  function onSubmitError(err: any) {
    console.log(err)
  }

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
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minuteAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountDownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountDownButton>
      </form>
    </HomeContainer>
  )
}
