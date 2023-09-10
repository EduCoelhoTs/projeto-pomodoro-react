import { zodResolver } from '@hookform/resolvers/zod'
import { FormContainer, MinutesAmountInput, TaskInput } from './styles'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'

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

export default function NewCycleForm() {
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
  return (
    // {...register('minuteAmount', { valueAsNumber: true })} */}
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
  )
}
