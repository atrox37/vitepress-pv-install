---
outline: deep
---

# 通道

## 概念定义
通道是设备（或网关)与平台之间建立通信所使用的**逻辑链路**，包含了完成数据读写所需的一整套必要配置信息。
简单来说，通道定义了：

- 使用哪种协议与设备通信；
- 如何连接设备；
- 使用什么参数进行数据读写；
- 如何保持通信和进行错误重试。
通道是设备通信的基础，是所有点位读写操作的前提。

## 通道包含的配置项
**Basic Information：**

  - `id`：通道的唯一标识。
  - `name`：通道的名称。
  - `description`：对通道的描述。
  - `protocol`：通道所遵循的协议，目前有`modbus_tcp`、`modbus_rtu`、`di_do` 协议。
  - `enabled`：通道是否可用。

**Parameters**：
根据 **protocol** 动态切换，常见参数说明：

- **modbus_tcp**
    - `host`：主机地址（IP/域名）。
    - `port`：端口（默认 502）。范围：1-65535。
    - `connect_timeout_ms`：连接超时（正整数，毫秒）。
    - `read_timeout_ms`：读取超时（正整数，毫秒）。
- **modbus_rtu**
    - `device`：串口设备路径（如 /dev/ttyS0、COM3）
    - `baud_rate`：波特率（典型值：9600/19200/38400/115200）
    - `data_bits`：数据位（常用 8）
    - `stop_bits`：停止位（1 或 2）
    - `parity`：校验位（N=无、E=偶校验、O=奇校验）
    - `connect_timeout_ms`：连接超时（正整数，毫秒）
    - `read_timeout_ms`：读取超时（正整数，毫秒）
    - `retry_interval_ms`：读写失败后的重试间隔（正整数，毫秒）

**Running Status：**

- `connected`：通道是否连接（Connected/Disconnected）。
- `running`：运行状态（Running/Stop）。
- `last_update`：最后更新时间。
- `error_count`：错误数量。
- `last_error`：最后的错误信息。

**Point Counts：**

- `telemetry`：遥测点位数量。
- `signal`：遥信点位数量。
- `control`：遥控点位数量。
- `adjustment`：遥调点位数量。

## 通道的作用
通道与设备通信的全过程都离不开通道的作用，包括：

- 平台或网关如何建立连接（串口 / TCP / RTU / 以太网等）；
- 如何从设备读取数据；
- 如何向设备写入或下发指令；
- 如何监控通信状态并进行异常处理。
通俗理解为：
通道 = 设备通信所需的“线路 + 协议 + 参数”。
