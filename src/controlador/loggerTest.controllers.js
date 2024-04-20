class LoggerTestController {
    static loggerTest = (req, res) => {
        req.logger.fatal("Logger Test fatal");
        req.logger.error("Logger Test error");
        req.logger.warning("Logger Test warning");
        req.logger.info("Logger Test info");
        req.logger.http("Logger Test http");
        req.logger.debug("Logger Test debug");

        res.send({
            status: "success",
            message: "Todos los logger probados"
        })
    }
}


export { LoggerTestController }