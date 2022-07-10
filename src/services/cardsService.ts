import * as cardsRepository from "../repositories/cardsRepository.js";

export async function find() {
  const answer = await cardsRepository.find();
  return answer[0].name;
}