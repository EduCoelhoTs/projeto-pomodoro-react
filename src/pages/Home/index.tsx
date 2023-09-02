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

export function Home() {
  const { register, handleSubmit, watch } = useForm()

  function onSubmitForm(data: unknown) {
    console.log(data)
  }

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
      <form action="" onSubmit={handleSubmit(onSubmitForm)}>
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
