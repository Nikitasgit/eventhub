export namespace PollModel {
  export type Question = {
    id: string;
    title: string;
    answers: Answer[];
  };

  export type Answer = {
    id: string;
    title: string;
  };

  export type Form = {
    pollTitle: string;
    questions: Question[];
  };
}
