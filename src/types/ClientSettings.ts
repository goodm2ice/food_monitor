export enum Sex { Male = 'male', Female = 'female' }
export enum Activity { Sedentary = 's', LightlyActive  = 'l', ModeratelyActive = 'm', Active = 'a', VeryActive = 'v' }
export enum WeightGoal { Loss = 'l', Maintenance = 'm', Gain = 'g' }

export interface ClientSettings {
    sex: Sex
    age: number
    weight: number
    height: number
    activity: Activity
    goal: { type: WeightGoal.Maintenance }
        | { type: WeightGoal.Loss | WeightGoal.Gain, change: number, days: number }
    cmi: number
}
