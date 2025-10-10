# KrushiAI Data Flow Diagrams (DFD)

This document contains the Data Flow Diagrams for the KrushiAI system.

## DFD Level 0: Context Diagram

The Context Diagram provides a high-level overview of the KrushiAI system, showing it as a single process and its interaction with external entities.

```mermaid
graph TD
    A[Farmer] -->|Soil & Climate Data, Crop Image, Location| B(KrushiAI System)
    B -->|Crop Recommendation, Disease Diagnosis, Fertilizer Recommendation, Weather Forecast| A
```

## DFD Level 1

This diagram breaks down the KrushiAI system into its main functions, illustrating how data flows between these functions, external entities, and data stores.

```mermaid
graph TD
    subgraph KrushiAI System
        P1("1.0<br>Crop Recommendation")
        P2("2.0<br>Disease Recognition")
        P3("3.0<br>Fertilizer Recommendation")
        P4("4.0<br>Weather Forecast")
    end

    A[Farmer] -->|Soil & Climate Data| P1
    P1 -->|Crop Recommendation| A

    A -->|Crop Image| P2
    P2 -->|Disease Diagnosis| A

    A -->|Soil & Crop Type| P3
    P3 -->|Fertilizer Recommendation| A

    A -->|Location| P4
    P4 -->|Weather Forecast| A

    P1 <--> D1[(D1: Crop Data & Models)]
    P2 --> D2[(D2: Disease Model)]
    P3 <--> D3[(D3: Fertilizer Data & Models)]

    subgraph External Systems
      direction LR
      WeatherAPI[External Weather API]
    end

    WeatherAPI -->|Real-time Weather Data| P4
```

## DFD Level 2

This level provides a more detailed view of the key processes within the KrushiAI system.

### DFD Level 2: Crop Recommendation (Process 1.0)

```mermaid
graph TD
    subgraph Crop Recommendation Process
        P1_1("1.1<br>Validate Input Data")
        P1_2("1.2<br>Fetch Crop Model")
        P1_3("1.3<br>Predict Crop")
        P1_4("1.4<br>Format Recommendation")
    end

    A[Farmer] -->|Soil & Climate Data| P1_1
    P1_1 -->|Validated Data| P1_3
    P1_2 -->|Crop Model| P1_3
    P1_3 -->|Predicted Crop| P1_4
    P1_4 -->|Crop Recommendation| A

    P1_2 <--> D1[(D1: Crop Data & Models)]
```

### DFD Level 2: Disease Recognition (Process 2.0)

```mermaid
graph TD
    subgraph Disease Recognition Process
        P2_1("2.1<br>Preprocess Image")
        P2_2("2.2<br>Load Disease Model")
        P2_3("2.3<br>Classify Disease")
        P2_4("2.4<br>Generate Diagnosis")
    end

    A[Farmer] -->|Crop Image| P2_1
    P2_1 -->|Processed Image| P2_3
    P2_2 -->|Disease Model| P2_3
    P2_3 -->|Disease Class| P2_4
    P2_4 -->|Disease Diagnosis| A

    P2_2 <--> D2[(D2: Disease Model)]
```