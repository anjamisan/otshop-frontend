import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'conditionLabel',
  standalone: true
})
export class ConditionLabelPipe implements PipeTransform {
  private readonly conditionMap: Record<string, string> = {
    'NEW_WITH_TAGS': 'New with tags',
    'NEW_WITHOUT_TAGS': 'New without tags',
    'VERY_GOOD': 'Very good',
    'GOOD': 'Good',
    'SATISFACTORY': 'Satisfactory'
  };

  transform(value: string): string {
    return this.conditionMap[value] || value;
  }
}
