import { Members } from './members.model';


export interface FormResult {
  member: Members;
  crudType?: string;
  status?: boolean;
}
