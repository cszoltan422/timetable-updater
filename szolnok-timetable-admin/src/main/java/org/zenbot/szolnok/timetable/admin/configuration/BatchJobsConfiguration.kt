package org.zenbot.szolnok.timetable.admin.configuration

import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration

@Configuration
@ComponentScan(basePackages = arrayOf("org.zenbot.szolnok.timetable.backend.batch.bus",
        "org.zenbot.szolnok.timetable.backend.batch.stops",
        "org.zenbot.szolnok.timetable.backend.batch.news"))
class BatchJobsConfiguration