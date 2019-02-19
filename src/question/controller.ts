import { JsonController, Get } from 'routing-controllers'
import Question from './entity'


@JsonController()
export default class QuestionController {

    @Get('/questions')
    async allQuestions() {
        const question = await Question.find({relations : ['answer']})

        return { question }
    }

}