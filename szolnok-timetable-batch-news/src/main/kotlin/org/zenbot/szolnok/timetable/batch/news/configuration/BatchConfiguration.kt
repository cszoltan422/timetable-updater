package org.zenbot.szolnok.timetable.batch.news.configuration

import org.springframework.batch.core.Job
import org.springframework.batch.core.Step
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.zenbot.szolnok.timetable.batch.news.configuration.properties.NewsProperties

@Configuration
@EnableBatchProcessing
@EnableConfigurationProperties(NewsProperties::class)
class BatchConfiguration(
    private val jobBuilderFactory: JobBuilderFactory,
    private val getNewsJsoupElementsStep: Step,
    private val buildNewsArticleStep: Step
) {

    @Bean
    fun getSzolnokNewsJob(): Job {
        return jobBuilderFactory.get("getSzolnokNewsJob")
                .start(getNewsJsoupElementsStep)
                .next(buildNewsArticleStep)
                .build()
    }
}