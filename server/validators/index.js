const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }
    next();
  };
};

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('admin', 'member', 'viewer').default('viewer'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const departmentSchema = Joi.object({
  name: Joi.string().trim().required(),
  type: Joi.string().valid('technical', 'non-technical').required(),
  description: Joi.string().allow(''),
  lead: Joi.string().allow(''),
});

const eventSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().required(),
  date: Joi.date().required(),
  endDate: Joi.date().allow(null),
  time: Joi.string().required(),
  venue: Joi.string().required(),
  onlineLink: Joi.string().uri().allow(''),
  department: Joi.string().allow(''),
  type: Joi.string().valid('workshop', 'seminar', 'hackathon', 'meetup', 'competition', 'social', 'other'),
  registration: Joi.object({
    limit: Joi.number().min(0),
    deadline: Joi.date(),
  }),
  poster: Joi.string().allow(''),
  socialLinks: Joi.object({
    instagram: Joi.string().allow(''),
    twitter: Joi.string().allow(''),
    linkedin: Joi.string().allow(''),
  }),
  status: Joi.string().valid('draft', 'upcoming', 'ongoing', 'completed', 'cancelled'),
});

const financeSchema = Joi.object({
  type: Joi.string().valid('income', 'expense', 'sponsorship').required(),
  category: Joi.string().valid('event', 'sponsorship', 'membership', 'donation', 'equipment', 'venue', 'marketing', 'other').required(),
  title: Joi.string().trim().required(),
  description: Joi.string().allow(''),
  amount: Joi.number().min(0).required(),
  event: Joi.string().allow(''),
  sponsor: Joi.object({
    name: Joi.string().allow(''),
    contact: Joi.string().allow(''),
    type: Joi.string().valid('active', 'passive', ''),
  }),
  status: Joi.string().valid('completed', 'pending', 'cancelled'),
  date: Joi.date(),
});

const projectSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().required(),
  status: Joi.string().valid('new', 'ongoing', 'completed'),
  funding: Joi.number().min(0),
  tags: Joi.array().items(Joi.string()),
  github: Joi.string().uri().allow(''),
  startDate: Joi.date().allow(null),
  endDate: Joi.date().allow(null),
  department: Joi.string().allow(''),
});

const meetingSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().allow(''),
  date: Joi.date().required(),
  time: Joi.string().required(),
  venue: Joi.string().allow(''),
  onlineLink: Joi.string().uri().allow(''),
  type: Joi.string().valid('general', 'department', 'emergency', 'review'),
  agenda: Joi.array().items(
    Joi.object({
      topic: Joi.string().required(),
      duration: Joi.number().min(1),
      presenter: Joi.string().allow(''),
    })
  ),
  status: Joi.string().valid('scheduled', 'ongoing', 'completed', 'cancelled'),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  departmentSchema,
  eventSchema,
  financeSchema,
  projectSchema,
  meetingSchema,
};
