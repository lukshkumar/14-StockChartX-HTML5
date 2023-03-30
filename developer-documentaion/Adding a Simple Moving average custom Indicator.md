# Adding a Simple Moving average custom Indicator.

## Steps :
### 1. Displaying Indicator in IndicatorDialog.
- Assigning name and id to our indicator.
- Open TASdk.ts and define a new variable with an unique id.
`export const MySMAIndicator = 113;`
- Updating indicatorAlias and indicatorName, indicatorVisibility Objects to include indicator’s Alias, name and visibility respectively.
- Updating Indicators/utils.ts to include our new Indicator.

Above changes will enable our indicator’s presence in IndicatorDialog.
If you click the indicator from dialog it will show a warning as we are yet to implement the calculation.

#### Understanding the flow :
- When an Indicator is clicked the flow goes to the TAIndicator.ts file’s _initIndicator method we need to update this method using below steps.


### 2. Calculation and Formula integration.
- We’ll add our calculation in TASdk/MovingAverage.ts file.
- Define a new instance method for MovingAverage class.
```
MySMAIndicator(
    pSource: Field,
    iPeriods: number,
    sAlias: string
  ): Recordset {
    let dAvg = 0;
    let iPeriod = 0;
    let Field1;
    let Results = new Recordset();
    let iRecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(iRecordCount, sAlias);
    let iStart = iPeriods + 1;
    let nav = iStart;
    for (let iRecord = iStart; iRecord < iRecordCount + 1; iRecord++) {
      dAvg = 0;
      for (iPeriod = 1; iPeriod < iPeriods + 1; iPeriod++) {
        dAvg += pSource.value(nav);
        nav--;
      }
      nav += iPeriods;
      dAvg /= iPeriods;
      Field1.setValue(nav, dAvg);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }
```
(Refer Field.ts and Recordset.ts to know more about `Field` and `Recordset` data types).
Here, 
`pSource`: source field. In our case, its close price Field.
`iPeriods`: we will be using for calculation.
`sAlias`: Field name to initialize Field.

The above function returns data of type RecordSet which holds the result from our calculation.


### 3. Passing the result to Chart.
- Update TAIndicator.ts's getShortName() to handle our new Indicator by adding a new case.
```
case TASdk.MySMAIndicator:
    return "MySMA"
```
- Add a similar case in _initIndicator() in TAIndicator.ts file. This case will initialize our indicator with parameters required in step 2.
```
case TASdk.MySMAIndicator:
    this._isOverlay = true;
    this._fieldNames = [fieldName.INDICATOR];
    params[paramName.SOURCE] = dsSuffix.CLOSE;
    params[paramName.PERIODS] = 14;
    break;
```
Here,
`this._fieldnames` will be visible as indicator's value label.
- Go to calculate() method of TAIndicator and add a case for our indicator.
```
 case TASdk.MySMAIndicator:
        title = [sourceField.name, periods];
        recordSet = MovingAverage.prototype.MySMAIndicator(
          sourceField,
          periods,
          indicatorName
        );
        break;
```
Here,
We are calling the method defined in step 2.
`title` will appear on chart beside indicator's name.
`recordset` holds the result from our calculation.

Thats it, you can now click on the indicator's name from IndicatorDialog and it will be drawn on chart.



