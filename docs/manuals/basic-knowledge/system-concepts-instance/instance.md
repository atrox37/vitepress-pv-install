---
outline: deep
---

# 实例

## 概念定义

实例是产品模型在现场工程中的具体对象化表达（Asset/Device Instance），对应实际存在的一台设备、一个系统单元或一个逻辑对象（如 PCS_01、BESS_01、PCC_METER_01）。实例具有唯一标识 instance_id，并绑定一个 product_name，继承该产品的点位体系。
实例不仅是展示层的“设备条目”，更是平台进行状态计算、控制下发、告警定位等行为的最小业务承载单元。

## 字段解释

* `insance_id`：实例的id，是唯一的标识符。
* `instance_name`：实例的名称。
* `product_name`：实例所属的产品名称。
* `properties`：实例自身的属性。

## 作用

- 将“模板（产品）”落到“现场对象（实例）”
- 实例承载产品设备的配置属性（properties）与运行点位（measurement/action）
- 与现场通道（四遥）建立映射，实现数据采集与控制下发
