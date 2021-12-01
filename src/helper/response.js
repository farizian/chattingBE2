const standartResponse = {
  success: (res, data, message) => {
    const response = {
      field: data,
      success: true,
      code: 200,
      message,
    };
    res.status(200).json(response);
  },
  successlogin: (res, data, token) => {
    const response = {
      success: true,
      field: data,
      code: 200,
      message: 'login success',
      token,
    };
    res.status(200).json(response);
  },
  failed: (res, code, err) => {
    if (code === 500) {
      const response = {
        success: false,
        data: null,
        code,
        error: err,
        message: 'Internal Server Error',
      };
      res.status(500).json(response);
    } else if (code === 400) {
      const response = {
        success: false,
        data: null,
        code,
        error: err,
        message: 'Bad Request',
      };
      res.status(400).json(response);
    } else if (code === 423) {
      const response = {
        success: false,
        data: null,
        code,
        err,
      };
      res.status(423).json(response);
    } else if (code === 401) {
      const response = {
        success: false,
        data: null,
        code,
        error: err,
        message: 'Unauthorized',
      };
      res.status(401).json(response);
    } else if (code === 404) {
      const response = {
        success: false,
        data: null,
        code,
        error: err,
        message: 'Data Not Found',
      };
      res.status(411).json(response);
    } else if (code === 411) {
      const response = {
        success: false,
        data: null,
        code,
        error: err,
        message: 'Data Required',
      };
      res.status(404).json(response);
    } else if (code === 408) {
      const response = {
        success: false,
        data: null,
        code,
        error: err,
        message: 'Request Timeout',
      };
      res.status(408).json(response);
    }
  },
};

module.exports = standartResponse;
